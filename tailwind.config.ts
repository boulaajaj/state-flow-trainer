import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Redux Flow Colors
				action: 'hsl(var(--action-color))',
				reducer: 'hsl(var(--reducer-color))',
				store: 'hsl(var(--store-color))',
				selector: 'hsl(var(--selector-color))',
				render: 'hsl(var(--render-color))'
			},
			backgroundImage: {
				'redux-flow': 'var(--redux-flow-gradient)'
			},
			boxShadow: {
				'action-glow': 'var(--action-glow)',
				'reducer-glow': 'var(--reducer-glow)',
				'store-glow': 'var(--store-glow)',
				'selector-glow': 'var(--selector-glow)',
				'render-glow': 'var(--render-glow)'
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				// Redux Flow Animations
				'redux-flow': {
					'0%': { 
						transform: 'translateX(-100%)', 
						opacity: '0' 
					},
					'20%': { 
						transform: 'translateX(-80%)', 
						opacity: '0.8' 
					},
					'50%': { 
						transform: 'translateX(0%)', 
						opacity: '1' 
					},
					'70%': { 
						transform: 'translateX(20%)', 
						opacity: '0.8' 
					},
					'100%': { 
						transform: 'translateX(100%)', 
						opacity: '0' 
					}
				},
				'flow-pulse': {
					'0%, 100%': { 
						opacity: '0.4',
						transform: 'scale(1)' 
					},
					'50%': { 
						opacity: '1',
						transform: 'scale(1.1)' 
					}
				},
				'glow-pulse': {
					'0%, 100%': { 
						boxShadow: 'var(--action-glow)' 
					},
					'25%': { 
						boxShadow: 'var(--reducer-glow)' 
					},
					'50%': { 
						boxShadow: 'var(--store-glow)' 
					},
					'75%': { 
						boxShadow: 'var(--selector-glow)' 
					}
				},
				'slide-in-right': {
					'0%': { 
						transform: 'translateX(100%)',
						opacity: '0' 
					},
					'100%': { 
						transform: 'translateX(0)',
						opacity: '1' 
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'redux-flow': 'redux-flow 2s ease-in-out',
				'flow-pulse': 'flow-pulse 1.5s ease-in-out infinite',
				'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
				'slide-in-right': 'slide-in-right 0.3s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
