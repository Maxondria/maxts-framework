import { AxiosResponse } from "axios";
import Eventing from "./Eventing";
import Sync from "./Sync";
import Attributes from "./Attributes";

export interface UserProps {
  id?: number;
  name?: string;
  age?: number;
}

const baseURL = "http://localhost:3004/users";

export default class User {
  public events: Eventing = new Eventing();
  public sync: Sync<UserProps> = new Sync<UserProps>(baseURL);
  public attributes: Attributes<UserProps>;

  public constructor(attrs: UserProps) {
    this.attributes = new Attributes<UserProps>(attrs);
  }

  get on() {
    return this.events.on;
  }

  get trigger() {
    return this.events.trigger;
  }

  get get() {
    return this.attributes.get;
  }

  set(update: UserProps): void {
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
