/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'lh3.googleusercontent.com',
			},
			{
				protocol: 'https',
				hostname: 'firebasestorage.googleapis.com',
			},
		],
	},
	experimental: {
		serverActions: true,
		serverComponentsExternalPackages: [
			'@react-email/components',
			// '@react-email/render',
			'@react-email/tailwind',
		],
	},
};

module.exports = nextConfig;
