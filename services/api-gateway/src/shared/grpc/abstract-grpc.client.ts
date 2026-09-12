import { Metadata } from '@grpc/grpc-js';
import type { OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { mapGrpcRolesToRoles } from '@readytomog/common';
import { Role } from '@readytomog/contracts';
import { type Observable, lastValueFrom } from 'rxjs';

type UnwrapObservable<U> = U extends Observable<infer R> ? R : U;

export abstract class AbstractGrpcClient<T extends Record<string, any>> implements OnModuleInit {
  protected service!: T;

  protected constructor(
    private readonly client: ClientGrpc,
    private readonly serviceName: string,
  ) {}

  public onModuleInit() {
    this.service = this.client.getService<T>(this.serviceName);
  }

  public async call<K extends keyof T>(
    method: K,
    payload?: Parameters<T[K]>[0],
    metadata?: Metadata,
  ): Promise<UnwrapObservable<ReturnType<T[K]>>> {
    try {
      const observable = this.service[method](payload, metadata ?? new Metadata());
      const result = await lastValueFrom(observable);
      if (typeof result === 'object' && 'roles' in result) {
        const roles = result.roles as Role[];
        const mappedRoles = mapGrpcRolesToRoles(roles);
        result.roles = mappedRoles;
      }
      return result as UnwrapObservable<ReturnType<T[K]>>;
    } catch (error) {
      console.log('error', error);
      throw error;
    }
  }
}
