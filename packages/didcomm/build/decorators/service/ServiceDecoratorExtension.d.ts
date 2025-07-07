import type { BaseMessageConstructor } from '../../BaseMessage';
import type { ServiceDecoratorOptions } from './ServiceDecorator';
import { ServiceDecorator } from './ServiceDecorator';
export declare function ServiceDecorated<T extends BaseMessageConstructor>(Base: T): {
    new (...args: any[]): {
        service?: ServiceDecorator;
        setService(serviceData: ServiceDecoratorOptions): void;
        id: string;
        readonly type: string;
        generateId(): string;
    };
} & T;
