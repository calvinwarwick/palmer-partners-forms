
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
    
    console.log('Serving file request for:', fileName)
    
    if (!fileName) {
      console.error('No filename provided in request')
      return new Response('File name required', { status: 400, headers: corsHeaders })
    }

    // Create Supabase client with service role key for admin access
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase configuration')
      return new Response('Server configuration error', { status: 500, headers: corsHeaders })
    }

    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    console.log('Attempting to download file from storage:', fileName)

    // Get the file from storage using service role (bypasses RLS)
    const { data, error } = await supabase.storage
      .from('admin-files')
      .download(fileName)

    if (error) {
      console.error('Error downloading file:', error)
      return new Response(`File not found: ${error.message}`, { status: 404, headers: corsHeaders })
    }

    if (!data) {
      console.error('No data returned for file:', fileName)
      return new Response('File not found', { status: 404, headers: corsHeaders })
    }

    console.log('File downloaded successfully, size:', data.size)

    // Get file metadata to determine content type
    const { data: fileList, error: listError } = await supabase.storage
      .from('admin-files')
      .list('', { search: fileName })

    if (listError) {
      console.error('Error listing files:', listError)
    }

    const fileInfo = fileList?.find(f => f.name === fileName)
    let contentType = 'application/octet-stream'
    
    if (fileInfo?.metadata?.mimetype) {
      contentType = fileInfo.metadata.mimetype
    } else {
      // Fallback content type detection based on file extension
      const extension = fileName.split('.').pop()?.toLowerCase()
      switch (extension) {
        case 'pdf':
          contentType = 'application/pdf'
          break
        case 'jpg':
        case 'jpeg':
          contentType = 'image/jpeg'
          break
        case 'png':
          contentType = 'image/png'
          break
        case 'gif':
          contentType = 'image/gif'
          break
        case 'webp':
          contentType = 'image/webp'
          break
      }
    }

    console.log('Serving file with content type:', contentType)

    // Return the file with appropriate headers
    return new Response(data, {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': contentType,
        'Content-Disposition': `inline; filename="${fileName}"`,
        'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
      },
    })

  } catch (error) {
    console.error('Error serving file:', error)
    return new Response(`Internal server error: ${error.message}`, { 
      status: 500, 
      headers: corsHeaders 
    })
  }
})
