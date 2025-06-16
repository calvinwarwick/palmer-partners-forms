
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string;
  subject: string;
  html: string;
  attachment?: {
    filename: string;
    content: string;
    type: string;
  };
}

const handler = async (req: Request): Promise<Response> => {
  console.log('Email function called with method:', req.method);
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    console.error('Invalid method:', req.method);
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      {
        status: 405,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }

  try {
    console.log('Parsing request body...');
    const { to, subject, html, attachment }: EmailRequest = await req.json();

    console.log("Email details:");
    console.log("- To:", to);
    console.log("- Subject:", subject);
    console.log("- Has attachment:", !!attachment);

    // Validate required fields
    if (!to || !subject || !html) {
      console.error('Missing required fields:', { to: !!to, subject: !!subject, html: !!html });
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Check if Resend API key is available
    const apiKey = Deno.env.get("RESEND_API_KEY");
    if (!apiKey) {
      console.error('RESEND_API_KEY environment variable not set');
      return new Response(
        JSON.stringify({ error: "Email service not configured" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const emailPayload: any = {
      from: "Palmer & Partners <noreply@palmerpartners.uk>",
      to: [to],
      subject,
      html,
    };

    // Add attachment if provided
    if (attachment) {
      console.log("Adding attachment:", attachment.filename, "Type:", attachment.type, "Content length:", attachment.content.length);
      
      emailPayload.attachments = [{
        filename: attachment.filename,
        content: attachment.content,
        type: attachment.type,
      }];
    }

    console.log('Sending email via Resend...');
    const emailResponse = await resend.emails.send(emailPayload);

    if (emailResponse.error) {
      console.error('Resend API error:', emailResponse.error);
      return new Response(
        JSON.stringify({ error: emailResponse.error }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending email:", error);
    console.error("Error details:", error.message, error.stack);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
