/**
 * Generated using theia-extension-generator
 */

import { JunitCommandContribution, JunitMenuContribution } from './junit-contribution';
import {
    CommandContribution,
    MenuContribution
} from "@theia/core/lib/common";

import { ContainerModule } from "inversify";
import { JUnitRunService } from './junit-run-service';

export default new ContainerModule(bind => {
    // add your contribution bindings here
    bind(JUnitRunService).toSelf().inSingletonScope();
    bind(CommandContribution).to(JunitCommandContribution);
    bind(MenuContribution).to(JunitMenuContribution);
    
});