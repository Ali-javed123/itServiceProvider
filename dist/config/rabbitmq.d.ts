import { type Channel } from "amqplib";
export declare function connectRabbitMQ(): Promise<Channel>;
export declare function getChannel(): Promise<Channel>;
export declare function closeRabbitMQ(): Promise<void>;
//# sourceMappingURL=rabbitmq.d.ts.map