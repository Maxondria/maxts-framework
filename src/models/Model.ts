import { AxiosPromise, AxiosResponse } from "axios";

interface HasId {
  id?: number;
}

interface ModalAttributes<T> {
  set(update: T): void;
  get<K extends keyof T>(key: K): T[K];
  getAll(): T;
}

interface Sync<T> {
  save(data: T): AxiosPromise;
  fetch(id: number): AxiosPromise;
}

interface Events {
  on(eventName: string, callback: () => void): void;
  trigger(eventName: string): void;
}

export default class Model<T extends HasId> {
  constructor(
    private attributes: ModalAttributes<T>,
    private events: Events,
    private sync: Sync<T>
  ) {}

  get on() {
    return this.events.on;
  }

  get trigger() {
    return this.events.trigger;
  }

  get get() {
    return this.attributes.get;
  }

  set(update: T): void {
    this.attributes.set(update);
    this.trigger("change");
  }

  fetch(): void {
    const id = this.get("id");

    if (typeof id !== "number") {
      throw new Error("Cannot fetch without ID");
    }
    this.sync.fetch(id).then((response: AxiosResponse): void => {
      this.set(response.data);
    });
  }

  save(): void {
    const data = this.attributes.getAll();
    this.sync
      .save(data)
      .then((response: AxiosResponse): void => {
        this.trigger("save");
      })
      .catch(() => this.trigger("error"));
  }
}
