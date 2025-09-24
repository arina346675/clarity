FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY index.html /usr/share/nginx/html/
COPY styles /usr/share/nginx/html/styles
COPY scripts /usr/share/nginx/html/scripts
COPY assets /usr/share/nginx/html/assets
COPY robots.txt /usr/share/nginx/html/
COPY sitemap.xml /usr/share/nginx/html/
COPY site.webmanifest /usr/share/nginx/html/
EXPOSE 10000
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://127.0.0.1:10000/ || exit 1
