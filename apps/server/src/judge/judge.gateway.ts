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

@WebSocketGateway({ namespace: 'judge', cors: { origin: '*' } })
export class JudgeGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  // constructor() {}

  @WebSocketServer()
  server: Server;

  async afterInit(server: Server) {
    // console.log('on init');
  }

  async handleConnection(client: Socket, ...args: any[]) {
    // console.log('on connection', args);
  }

  async handleDisconnect(client: Socket) {
    // console.log('on disconnection');
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
