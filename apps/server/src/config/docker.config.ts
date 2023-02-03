import { registerAs } from '@nestjs/config';

const token = 'docker';

const dockerConfig = registerAs(token, () => ({
  socketPath: process.env.DOCKER_SOCKET_PATH || '/var/run/docker.sock',
  host: process.env.DOCKER_HOST,
  port:
    (process.env.DOCKER_PORT && parseInt(process.env.DOCKER_PORT, 10)) || 2375,
}));

export const dockerConfigTuple = [token, dockerConfig] as const;
