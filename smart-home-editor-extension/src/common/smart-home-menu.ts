import { injectable } from "inversify";
import { MenuContribution, MenuModelRegistry, MAIN_MENU_BAR } from "@theia/core";

export namespace SmartHomeMenus {

  export const SMART_HOME = [...MAIN_MENU_BAR, '9_smarthome'];

}

@injectable()
export class SmartHomeMenuContribution implements MenuContribution {

  registerMenus(registry: MenuModelRegistry): void {
    registry.registerSubmenu(SmartHomeMenus.SMART_HOME, 'SmartHome');
  }

}
