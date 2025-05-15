import { NextResponse } from 'next/server';

// Define the expected structure of the response from the n8n webhook
interface N8NResponse {
  succcess?: boolean; // Changed from success to succcess and made optional
  success?: boolean; // Added for robustness in case n8n sends 'success'
  title?: string;
  msg?: string; // Full content in Markdown
  abstract?: string; // Summary in Markdown
  highlights?: string[];
  error?: string; // Optional error message from n8n
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { link } = body;

    if (!link || typeof link !== 'string') {
      return NextResponse.json({ success: false, error: 'URL (link) 不能为空且必须是字符串' }, { status: 400 });
    }

    // Validate URL format (basic validation)
    try {
      new URL(link);
    } catch (e) {
      return NextResponse.json({ success: false, error: '无效的 URL 格式' }, { status: 400 });
    }

    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL || "https://n8n.judyplan.com/webhook/fecth-url";

    const n8nResponse = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ link }),
    });

    const n8nData: N8NResponse = await n8nResponse.json();

    if (!n8nResponse.ok) {
      // If n8n itself returns an error status, forward that information
      console.error('n8n webhook returned an error:', n8nData);
      return NextResponse.json(
        { 
          success: false, 
          error: n8nData.error || `n8n webhook 请求失败，状态码: ${n8nResponse.status}` 
        },
        { status: n8nResponse.status }
      );
    }
    
    // Check the 'succcess' field from n8n's response payload primarily, fallback to 'success'
    const n8nCallWasSuccessful = n8nData.succcess === true || n8nData.success === true;

    if (n8nCallWasSuccessful) {
        // Map to the frontend's expected 'success' field
        return NextResponse.json({
            success: true,
            title: n8nData.title,
            msg: n8nData.msg,
            abstract: n8nData.abstract,
            highlights: n8nData.highlights
            // Keep other fields from n8nData if they exist and are simple to pass through
        });
    } else {
        // If n8n call was successful (e.g., 200 OK) but operation failed (succcess: false or missing in payload)
        console.error('n8n webhook reported an operational error or missing success flag:', n8nData);
        return NextResponse.json(
            { 
                success: false, 
                error: n8nData.error || 'n8n webhook 操作失败或未返回明确成功标识。' 
            }, 
            { status: 200 } // API call itself was fine, but n8n logic failed
        );
    }

  } catch (error: any) {
    console.error('Error in /api/fetch-url:', error);
    return NextResponse.json({ success: false, error: error.message || '服务器内部错误' }, { status: 500 });
  }
} 