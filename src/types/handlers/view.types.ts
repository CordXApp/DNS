export interface ViewHandler {
  handler: (req: any, res: any) => Promise<void>;
  validate: (req: any, res: any) => Promise<void>;
}
