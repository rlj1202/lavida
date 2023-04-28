import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { SubmissionStatus } from 'src/submissions/entities/submission.entity';

@WebSocketGateway({ namespace: 'judge', cors: { origin: '*' } })
export class JudgeGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(JudgeGateway.name);

  constructor() {
    return;
  }

  @WebSocketServer()
  server: Server;

  async afterInit(_server: Server) {
    this.logger.verbose('Init');
  }

  async handleConnection(_client: Socket, ..._args: any[]) {
    this.logger.verbose('WS connected');
  }

  async handleDisconnect(_client: Socket) {
    this.logger.verbose('WS disconnected');
  }

  async reportStatus(
    submissionId: number,
    progress: number,
    status: SubmissionStatus,
  ) {
    this.server.to(`${submissionId}`).emit('status', {
      submissionId,
      progress,
      status,
    });
  }

  @SubscribeMessage('getJudgeStatus')
  async getJudgeStatus(
    @ConnectedSocket() client: Socket,
    @MessageBody('submissionId') submissionId: number,
  ) {
    client.join(`${submissionId}`);
  }
}
