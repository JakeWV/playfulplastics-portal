module.exports = {
  apps: [
    {
      name: "portal",
      cwd: "/var/www/playfulplastics-portal",
      script: "npm",
      args: "run start",
      env: {
        NODE_ENV: "production",
        DATABASE_URL: "postgresql://pgportal:PgPortalPass123@localhost:5432/pgportal",
        NEXTAUTH_SECRET: "nJAsOHrOEHyJuPGJsIfaC1OmWwQdmRK5lq1kQmQtIT8=",
        NEXTAUTH_URL: "http://137.184.112.72:3000",
        PORTAL_NAME: "Playful Plastics Consignment",
        UPLOAD_DIR: "/var/www/playfulplastics-portal/uploads",
      },
    },
  ],
};
