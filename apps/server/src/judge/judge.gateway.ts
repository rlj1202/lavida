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
import { JudgeStatus } from './judge.service';

const LOG_CONTEXT = 'JudgeGateway';

@WebSocketGateway({ namespace: 'judge', cors: { origin: '*' } })
export class JudgeGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  // constructor() {}

  @WebSocketServer()
  server: Server;

  async afterInit(server: Server) {
    Logger.log('Init', LOG_CONTEXT);
  }

  async handleConnection(client: Socket, ...args: any[]) {
    Logger.log('WS connected', LOG_CONTEXT);
  }

  async handleDisconnect(client: Socket) {
    Logger.log('WS disconnected', LOG_CONTEXT);
  }

  async reportStatus(
    submissionId: number,
    progress: number,
    status: JudgeStatus,
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
