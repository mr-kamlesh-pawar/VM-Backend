import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Call the parent method to validate the user
    const result = (await super.canActivate(context)) as boolean;
    if (result) {
      // Optionally, you can add custom logic here before allowing access
    }
    return result;
  }
}
