import { Module } from '@nestjs/common';
import { MailService } from './mail.service';

@Module({
  providers: [MailService],
  exports: [MailService],  // Export MailService to make it available in other modules
})
export class MailModule {}
