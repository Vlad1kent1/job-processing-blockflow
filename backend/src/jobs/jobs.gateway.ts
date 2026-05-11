import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { PrismaService } from '../prisma/prisma.service';

export type JobUpdatePayload = {
  id: string;
  status: string;
  progress: number;
};

@Injectable()
@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL ?? 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
  transports: ['websocket', 'polling'],
})
export class JobsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly prisma: PrismaService) {}

  handleConnection(client: Socket) {
    // Connection established successfully
  }

  handleDisconnect(client: Socket) {
    // Client disconnected
  }

  @SubscribeMessage('subscribeToJob')
  async handleSubscribeToJob(
    @MessageBody() payload: { jobId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const room = `job_${payload.jobId}`;
    client.join(room);
    client.emit('subscribed', { room });
    await this.sendJobUpdate(payload.jobId);
  }

  async sendJobUpdate(jobId: string) {
    const job = await this.prisma.job.findUnique({
      where: { id: jobId },
      select: { id: true, status: true, progress: true },
    });

    if (!job) {
      return;
    }

    this.emitJobUpdate(jobId, {
      id: job.id,
      status: job.status,
      progress: job.progress,
    });
  }

  emitJobUpdate(jobId: string, update: JobUpdatePayload) {
    this.server.to(`job_${jobId}`).emit('job.update', update);
  }
}
