import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OpaqueRefreshAuthGuard extends AuthGuard('opaque-refresh') {}
