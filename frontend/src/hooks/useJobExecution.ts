'use client';

import { useRef, useEffect } from 'react';
import axios from 'axios';
import { io, Socket } from 'socket.io-client';
import { useOnboardingStore } from '../store/useOnboardingStore';

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export function useJobExecution() {
  const store = useOnboardingStore();
  const socketRef = useRef<Socket | null>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  const apiClient = axios.create({ baseURL: API_URL });

  const startWebSocketJob = async () => {
    const jobId = store.jobId;
    if (!jobId) {
      alert('Job ID is missing. Please complete step 3 first.');
      return;
    }

    try {
      store.setJobStatus('queued');
      store.setProgress(0);
      store.setMethod('ws');
      store.setResult('');

      const socket = io(API_URL, {
        transports: ['websocket'],
        autoConnect: false,
      });

      socket.on('connect', () => {
        socket.emit('subscribeToJob', { jobId });
      });

      socket.on('job.update', (update: { id: string; status: string; progress: number }) => {
        store.setJobStatus(update.status as any);
        store.setProgress(update.progress);

        if (update.status === 'done' || update.status === 'failed') {
          socket.disconnect();
          socketRef.current = null;
          if (update.status === 'done') {
            fetchFinalResult(jobId);
          }
        }
      });

      socket.on('connect_error', () => {
        store.setJobStatus('failed');
        store.setResult('WebSocket connection failed.');
      });

      socket.connect();
      socketRef.current = socket;
    } catch (error) {
      store.setJobStatus('failed');
      store.setResult('Failed to start WS updates.');
      alert('Error starting WebSocket: ' + (error as Error).message);
    }
  };

  const startHttpJob = async () => {
    const jobId = store.jobId;
    if (!jobId) {
      alert('Job ID is missing. Please complete step 3 first.');
      return;
    }

    try {
      store.setJobStatus('queued');
      store.setProgress(0);
      store.setMethod('http');
      store.setResult('');
      store.setIsPolling(true);

      pollingRef.current = setInterval(async () => {
        try {
          const latest = await apiClient.get(`/jobs/${jobId}`);
          store.setJobStatus(latest.data.status as any);
          store.setProgress(latest.data.progress ?? 0);

          if (latest.data.status === 'done' || latest.data.status === 'failed') {
            stopPolling();
            store.setResult(latest.data.result ?? 'Result ready.');
            store.setIsPolling(false);
          }
        } catch (error) {
          stopPolling();
          store.setJobStatus('failed');
          store.setResult('Failed to poll job updates.');
          store.setIsPolling(false);
          alert('Error polling job: ' + (error as Error).message);
        }
      }, 1000);
    } catch (error) {
      store.setJobStatus('failed');
      store.setResult('Failed to start polling.');
      store.setIsPolling(false);
      alert('Error starting HTTP polling: ' + (error as Error).message);
    }
  };

  const stopPolling = () => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  };

  const fetchFinalResult = async (jobId: string) => {
    try {
      const data = await apiClient.get(`/jobs/${jobId}`);
      store.setResult(data.data.result ?? 'Result ready.');
    } catch {
      store.setResult('Result loaded.');
    }
  };

  const resetJob = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    stopPolling();
    store.resetToStep2();
  };

  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      stopPolling();
    };
  }, []);

  return {
    startWebSocketJob,
    startHttpJob,
    resetJob,
  };
}
