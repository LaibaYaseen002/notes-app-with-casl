import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CHECK_POLICIES_KEY } from './check-policies.decorator';
import { PolicyHandler } from './types';
import { AppAbility, CaslAbilityFactory } from './casl-ability.factory';

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const policyHandlers =
      this.reflector.get<PolicyHandler[]>(CHECK_POLICIES_KEY, context.getHandler()) || [];

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const ability = this.caslAbilityFactory.createForUser(user);

    const canAccess = policyHandlers.every((handler) =>
      this.execPolicyHandler(handler, ability)
    );

    if (!canAccess) {
      throw new ForbiddenException('Access denied by CASL policy');
    }

    return true;
  }

  private execPolicyHandler(handler: PolicyHandler, ability: AppAbility): boolean {
    if (typeof handler === 'function') {
      return handler(ability);
    }
    return handler.handle(ability);
  }
}
