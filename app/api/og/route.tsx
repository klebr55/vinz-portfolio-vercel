import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title') || 'Kleber Vinicius';
    const subtitle = searchParams.get('subtitle') || 'Front-End Web Developer';

    return new ImageResponse(
      (
        <div
          style={{
            background: 'linear-gradient(90deg, rgb(2,0,36) 0%, rgb(59,59,68) 26%, rgb(93,108,111) 100%)',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'Inter, sans-serif',
            color: 'white',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              maxWidth: '800px',
              padding: '40px',
            }}
          >
            {/* Logo */}
            <div
              style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '48px',
                fontWeight: 'bold',
                border: '3px solid rgba(255, 255, 255, 0.3)',
                marginBottom: '30px',
              }}
            >
              KV
            </div>

            {/* Título */}
            <h1
              style={{
                fontSize: '48px',
                fontWeight: '700',
                margin: '0 0 20px 0',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              {title}
            </h1>

            {/* Subtítulo */}
            <h2
              style={{
                fontSize: '24px',
                fontWeight: '400',
                opacity: 0.9,
                margin: '0 0 30px 0',
              }}
            >
              {subtitle}
            </h2>

            {/* Tech Stack */}
            <div
              style={{
                display: 'flex',
                gap: '20px',
                fontSize: '16px',
                opacity: 0.8,
              }}
            >
              {['React.js', 'Next.js', 'TypeScript', 'TailwindCSS'].map((tech) => (
                <div
                  key={tech}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  {tech}
                </div>
              ))}
            </div>

            {/* Website */}
            <div
              style={{
                position: 'absolute',
                bottom: '30px',
                right: '40px',
                fontSize: '18px',
                opacity: 0.7,
              }}
            >
              klebervinicius.dev
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        headers: {
          'Cache-Control': 'public, s-maxage=31536000, stale-while-revalidate',
        },
      }
    );
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : 'Unknown error';
    console.log(`Error generating OG image: ${errorMessage}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
