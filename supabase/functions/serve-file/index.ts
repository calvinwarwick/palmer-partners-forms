
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const fileName = url.pathname.split('/').pop()
    
    if (!fileName) {
      return new Response('File name required', { status: 400, headers: corsHeaders })
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get the file from storage
    const { data, error } = await supabase.storage
      .from('admin-files')
      .download(fileName)

    if (error) {
      console.error('Error downloading file:', error)
      return new Response('File not found', { status: 404, headers: corsHeaders })
    }

    // Get file metadata to determine content type
    const { data: fileList } = await supabase.storage
      .from('admin-files')
      .list('', { search: fileName })

    const fileInfo = fileList?.find(f => f.name === fileName)
    const contentType = fileInfo?.metadata?.mimetype || 'application/octet-stream'

    // Return the file with appropriate headers
    return new Response(data, {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
      },
    })

  } catch (error) {
    console.error('Error serving file:', error)
    return new Response('Internal server error', { 
      status: 500, 
      headers: corsHeaders 
    })
  }
})
