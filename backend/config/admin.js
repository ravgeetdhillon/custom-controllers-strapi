module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', 'd72fb0a47eabf70331bc7a98d37ba2b7'),
  },
});
