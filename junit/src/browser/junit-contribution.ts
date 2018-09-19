import { CommandContribution, CommandRegistry, MenuContribution, MenuModelRegistry, SelectionService } from '@theia/core/lib/common';
import URI from '@theia/core/lib/common/uri';
import { SingleUriCommandHandler, UriAwareCommandHandler } from '@theia/core/lib/common/uri-command-handler';
import { inject, injectable } from 'inversify';
import { JUnitRunService } from './junit-run-service';
import { NAVIGATOR_CONTEXT_MENU } from "@theia/navigator/lib/browser/navigator-contribution";

const JUnitRunCommand = {
    id: 'junit.run.command',
    label: 'Run JUnit Test'
};

@injectable()
export class JunitCommandContribution implements CommandContribution {

    constructor(
        @inject(SelectionService) private readonly selectionService: SelectionService,
        @inject(JUnitRunService) private readonly junitRunService: JUnitRunService,
    ) { }

    registerCommands(registry: CommandRegistry): void {
        registry.registerCommand(JUnitRunCommand, 
            new UriAwareCommandHandler(this.selectionService, new JUnitRunCommandHandler(this.junitRunService))
        );
    }
}

class JUnitRunCommandHandler implements SingleUriCommandHandler {
    constructor(private junitRunService: JUnitRunService) { }
    execute(uri: URI): void { this.junitRunService.runTest(uri) }
    isVisible(uri: URI): boolean { return uri.toString().endsWith('Test.java') }
}

@injectable()
export class JunitMenuContribution implements MenuContribution {

    registerMenus(menus: MenuModelRegistry): void {
        // Add to context menu in finder
        menus.registerMenuAction(NAVIGATOR_CONTEXT_MENU, {
            commandId: JUnitRunCommand.id,
        });
    }
}