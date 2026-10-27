import type {
	CommentConfig,
	ExpressiveCodeConfig,
	LicenseConfig,
	NavBarConfig,
	ProfileConfig,
	SiteConfig,
} from "./types/config";

export const siteConfig: SiteConfig = {
	title: "MFxian Blog",
	subtitle: "",
	lang: "zh_CN", // Language code, e.g. 'en', 'zh_CN', 'ja', etc.
	themeColor: {
		hue: 250, // Default hue for the theme color, from 0 to 360. e.g. red: 0, teal: 200, cyan: 250, pink: 345
		fixed: false, // Hide the theme color picker for visitors
	},
	banner: {
		enable: true,
		src: "assets/images/banner.jpg", // Relative to the /src directory. Relative to the /public directory if it starts with '/'
		position: "center", // Equivalent to object-position, only supports 'top', 'center', 'bottom'. 'center' by default
		credit: {
			enable: true, // Display the credit text of the banner image
			text: "Photo by Venti Views on Unsplash", // Credit text to be displayed
			url: "https://unsplash.com/photos/oCP-NL2l7gc", // (Optional) URL link to the original artwork or artist's page
		},
	},
	toc: {
		enable: true, // Display the table of contents on the right side of the post
		depth: 2, // Maximum heading depth to show in the table, from 1 to 3
	},
	favicon: [
		// Leave this array empty to use the default favicon
		// {
		//   src: '/favicon/icon.png',    // Path of the favicon, relative to the /public directory
		//   theme: 'light',              // (Optional) Either 'light' or 'dark', set only if you have different favicons for light and dark mode
		//   sizes: '32x32',              // (Optional) Size of the favicon, set only if you have favicons of different sizes
		// }
	],
};

export const navBarConfig: NavBarConfig = {
	links: [
		{ name: "Blog", url: "/" },
		{ name: "Notes", url: "/notes/" },
		// Hidden until they have content; the pages still exist.
		// { name: "Lab", url: "/lab/" },
		// { name: "Talks", url: "/talks/" },
		// { name: "Projects", url: "/projects/" },
		{ name: "Archive", url: "/archive/" },
		// { name: "Links", url: "/links/" },
		{ name: "About", url: "/about/" },
		// { name: "Contact", url: "/contact/" },
		{
			name: "GitHub",
			url: "https://github.com/UEPBFOM", // Internal links should not include the base path, as it is automatically added
			external: true, // Show an external link icon and will open in a new tab
		},
	],
};

export const profileConfig: ProfileConfig = {
	avatar: "assets/images/avatar.jpg", // Relative to the /src directory. Relative to the /public directory if it starts with '/'
	name: "MFxian",
	bio: "不要让上学耽误了学习",
	links: [
		{
			name: "GitHub",
			icon: "fa6-brands:github",
			url: "https://github.com/UEPBFOM",
		},
	],
};

export const licenseConfig: LicenseConfig = {
	enable: false,
	name: "CC BY-NC-SA 4.0",
	url: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
};

// Comments are stored in GitHub Discussions through giscus (https://giscus.app).
// Fill in the values that page generates for your repo, then set enable to true.
export const commentConfig: CommentConfig = {
	enable: true,
	giscus: {
		repo: "UEPBFOM/blog",
		repoId: "R_kgDOVZL-cw",
		category: "Announcements",
		categoryId: "DIC_kwDOVZL-c84DJvYL",
	},
};

export const expressiveCodeConfig: ExpressiveCodeConfig = {
	// Note: Some styles (such as background color) are being overridden, see the astro.config.mjs file.
	// Please select a dark theme, as this blog theme currently only supports dark background color
	theme: "github-dark",
};
