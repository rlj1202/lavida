import { registerAs } from '@nestjs/config';

export default registerAs('docker', () => ({
  socketPath: process.env.DOCKER_SOCKET_PATH || '/var/run/docker.sock',
  host: process.env.DOCKER_HOST,
  port:
    (process.env.DOCKER_PORT && parseInt(process.env.DOCKER_PORT, 10)) || 2375,
}));
