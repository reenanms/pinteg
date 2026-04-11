// vite.config.mts
import { defineConfig } from "file:///C:/Users/reena/Desktop/repo/pinteg/packages/pinteg-react/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/reena/Desktop/repo/pinteg/node_modules/@vitejs/plugin-react/dist/index.js";
import cssInjectedByJsPlugin from "file:///C:/Users/reena/Desktop/repo/pinteg/node_modules/vite-plugin-css-injected-by-js/dist/esm/index.js";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    cssInjectedByJsPlugin()
  ],
  build: {
    lib: {
      entry: "src/index.ts",
      name: "pinteg",
      formats: ["es"],
      fileName: "pinteg"
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime", "pinteg-core"],
      output: {
        preserveModules: false,
        inlineDynamicImports: false
      }
    }
  },
  // @ts-ignore
  test: {
    environment: "jsdom",
    globals: true,
    include: ["tst/**/*.{test,spec}.{ts,tsx}"]
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcubXRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxccmVlbmFcXFxcRGVza3RvcFxcXFxyZXBvXFxcXHBpbnRlZ1xcXFxwYWNrYWdlc1xcXFxwaW50ZWctcmVhY3RcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXHJlZW5hXFxcXERlc2t0b3BcXFxccmVwb1xcXFxwaW50ZWdcXFxccGFja2FnZXNcXFxccGludGVnLXJlYWN0XFxcXHZpdGUuY29uZmlnLm10c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvcmVlbmEvRGVza3RvcC9yZXBvL3BpbnRlZy9wYWNrYWdlcy9waW50ZWctcmVhY3Qvdml0ZS5jb25maWcubXRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XHJcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XHJcbmltcG9ydCBjc3NJbmplY3RlZEJ5SnNQbHVnaW4gZnJvbSAndml0ZS1wbHVnaW4tY3NzLWluamVjdGVkLWJ5LWpzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcbiAgICBwbHVnaW5zOiBbXHJcbiAgICAgICAgcmVhY3QoKSxcclxuICAgICAgICBjc3NJbmplY3RlZEJ5SnNQbHVnaW4oKVxyXG4gICAgXSxcclxuICAgIGJ1aWxkOiB7XHJcbiAgICAgICAgbGliOiB7XHJcbiAgICAgICAgICAgIGVudHJ5OiAnc3JjL2luZGV4LnRzJyxcclxuICAgICAgICAgICAgbmFtZTogJ3BpbnRlZycsXHJcbiAgICAgICAgICAgIGZvcm1hdHM6IFsnZXMnXSxcclxuICAgICAgICAgICAgZmlsZU5hbWU6ICdwaW50ZWcnXHJcbiAgICAgICAgfSxcclxuICAgICAgICByb2xsdXBPcHRpb25zOiB7XHJcbiAgICAgICAgICAgIGV4dGVybmFsOiBbJ3JlYWN0JywgJ3JlYWN0LWRvbScsICdyZWFjdC9qc3gtcnVudGltZScsICdwaW50ZWctY29yZSddLFxyXG5cclxuICAgICAgICAgICAgb3V0cHV0OiB7XHJcbiAgICAgICAgICAgICAgICBwcmVzZXJ2ZU1vZHVsZXM6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgaW5saW5lRHluYW1pY0ltcG9ydHM6IGZhbHNlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgdGVzdDoge1xyXG4gICAgICAgIGVudmlyb25tZW50OiAnanNkb20nLFxyXG4gICAgICAgIGdsb2JhbHM6IHRydWUsXHJcbiAgICAgICAgaW5jbHVkZTogWyd0c3QvKiovKi57dGVzdCxzcGVjfS57dHMsdHN4fSddXHJcbiAgICB9XHJcbn0pO1xyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQTRXLFNBQVMsb0JBQW9CO0FBQ3pZLE9BQU8sV0FBVztBQUNsQixPQUFPLDJCQUEyQjtBQUVsQyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUN4QixTQUFTO0FBQUEsSUFDTCxNQUFNO0FBQUEsSUFDTixzQkFBc0I7QUFBQSxFQUMxQjtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ0gsS0FBSztBQUFBLE1BQ0QsT0FBTztBQUFBLE1BQ1AsTUFBTTtBQUFBLE1BQ04sU0FBUyxDQUFDLElBQUk7QUFBQSxNQUNkLFVBQVU7QUFBQSxJQUNkO0FBQUEsSUFDQSxlQUFlO0FBQUEsTUFDWCxVQUFVLENBQUMsU0FBUyxhQUFhLHFCQUFxQixhQUFhO0FBQUEsTUFFbkUsUUFBUTtBQUFBLFFBQ0osaUJBQWlCO0FBQUEsUUFDakIsc0JBQXNCO0FBQUEsTUFDMUI7QUFBQSxJQUNKO0FBQUEsRUFDSjtBQUFBO0FBQUEsRUFFQSxNQUFNO0FBQUEsSUFDRixhQUFhO0FBQUEsSUFDYixTQUFTO0FBQUEsSUFDVCxTQUFTLENBQUMsK0JBQStCO0FBQUEsRUFDN0M7QUFDSixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
