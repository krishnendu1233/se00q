/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/aligner/:path*',
        destination: 'https://aligner-for-creators.vercel.app/:path*',
      },
      {
        source: '/youtube-filterer/:path*',
        destination: 'https://youtube-format-filterer.vercel.app/:path*',
      },
      {
        source: '/b-rolls/:path*',
        destination: 'https://b-rolls-suggestor.vercel.app/:path*',
      },
      {
        source: '/z03-predictor/:path*',
        destination: 'https://z03-outlier-predictor.vercel.app/:path*',
      },
      {
        source: '/elevenlabs-alt/:path*',
        destination: 'https://krudev-elevenlabs-alternative.hf.space/:path*',
      },
      {
        source: '/saliency/:path*',
        destination: 'https://krudev-saliency-retention-analyzer.hf.space/:path*',
      }
    ];
  },
};

module.exports = nextConfig;
