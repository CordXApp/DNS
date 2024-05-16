export interface ViewHandler {
    handler: (req: any, res: any) => Promise<void>;
    preHandler: (req: any, res: any) => Promise<void>;
}