import type { IEventProps } from "../@types/client";

export class Event {
    public props: IEventProps;

    constructor(props: IEventProps) {
        this.props = props;
    }
}