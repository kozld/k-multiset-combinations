import { Injectable } from '@nestjs/common';
import * as os from 'os';

@Injectable()
export class StatusService {
  getStatus() {
    return {
      status: 'ok',
      uptime: process.uptime(),
      hostname: os.hostname(),
      timestamp: new Date().toISOString(),
      commitHash: process.env.COMMIT_HASH || 'unknown',
    };
  }
}
