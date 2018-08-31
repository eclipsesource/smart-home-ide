import { injectable, inject } from "inversify";
import { CommandContribution, CommandRegistry, MenuContribution, MenuModelRegistry, SelectionService, notEmpty, UriSelection, MessageService } from "@theia/core/lib/common";
import { UriAwareCommandHandler, UriCommandHandler } from "@theia/core/lib/common/uri-command-handler";
import URI from '@theia/core/lib/common/uri';
import { FileSystem } from "@theia/filesystem/lib/common/filesystem";
import { IYoServer, ScaffoldingOptions } from "../common/scaffolding-protocol";
import { ScaffoldingDialog } from "./scaffolding-dialog";
import { SmartHomeMenus } from "../common/smart-home-menu";
import { WorkspaceService } from "@theia/workspace/lib/browser/workspace-service";
import *  as _ from 'lodash';
export { SmartHomeMenus } from "../common/smart-home-menu";

export const DeployToEditorCommand = {
    id: 'SmartHomeEditor.deploy.command',
    label: "Deploy App"
};

export const ScaffoldingCommand = {
    id: 'SmartHomeEditor.scaffolding.command',
    label: "Create New Project"
};

@injectable()
export class SmartHomeEditorCommandContribution implements CommandContribution {

    @inject(SelectionService)
    protected readonly selectionService: SelectionService;

    @inject(MessageService)
    protected readonly messageService: MessageService;

    @inject(FileSystem)
    protected readonly filesystem: FileSystem;

    @inject(IYoServer)
    protected readonly yoServer: IYoServer;

    @inject(WorkspaceService)
    protected readonly workspaceService: WorkspaceService;

    registerCommands(registry: CommandRegistry): void {
        const handler = new UriAwareCommandHandler<URI[]>(this.selectionService, this.deployHandler(), { multi: true });
        registry.registerCommand(ScaffoldingCommand, this.scaffoldingHandler());
        registry.registerCommand(DeployToEditorCommand, handler);
    }

    protected scaffoldingHandler() {
        return {
            execute: () => {

                this.workspaceService.roots.then(roots => {
                    const workspaceLocation = new URL(roots[0].uri).pathname;

                    if (_.isEmpty(workspaceLocation)) {
                        console.error("No workspace open"); // TODO: use message service
                        return;
                    }

                    const dialog = new ScaffoldingDialog();
                    dialog.open().then(result => {
                        const options: ScaffoldingOptions = {
                            appName: result.appName,
                            appDescription: result.appDescription,
                            appNameSpace: result.appNameSpace,
                            authorName: result.authorName,
                            destinationPath: workspaceLocation
                        };
                        this.yoServer.requestYo(options);

                    });
                });

            }
        }
    }

    protected deployHandler(): UriCommandHandler<URI[]> {
        return {
            execute: uris => this.deployApp(uris),
            isEnabled: uris => this.isDeployEnabled(uris),
            isVisible: uris => this.isDeployVisible(uris),
        };
    }
    protected async deployApp(uris: URI[]): Promise<void> {
        new Promise(() => {
            uris.forEach(uri => {
                const fileStat = this.filesystem.copy(
                    uri.toString(),
                    "file:///usr/local/addons/essh/.essh_store/" + uri.displayName,
                    { overwrite: true, recursive: true }
                );
                fileStat.then(
                    () => this.messageService.info(`${uri.displayName} was successfully deployed to ${uri}.`),
                    err => this.messageService.error(`${uri.displayName} could not be deployed: ${err}`));
            })
            null
        })
    }
    protected isDeployEnabled(uris: URI[]): boolean {
        return uris.length > 0 && uris.every(u => u.scheme === 'file') && uris.every(u => u.path.ext === '.jar');
    }
    protected isDeployVisible(uris: URI[]): boolean {
        return this.isDeployEnabled(uris);
    }
    protected getUris(uri: Object | undefined): URI[] {
        if (uri === undefined) {
            return [];
        }
        return (Array.isArray(uri) ? uri : [uri]).map(u => this.getUri(u)).filter(notEmpty);
    }
    protected getUri(uri: Object | undefined): URI | undefined {
        if (uri instanceof URI) {
            return uri;
        }
        if (UriSelection.is(uri)) {
            return uri.uri;
        }
        return undefined;
    }
}

@injectable()
export class SmartHomeEditorMenuContribution implements MenuContribution {

    registerMenus(menus: MenuModelRegistry): void {
        menus.registerMenuAction(SmartHomeMenus.SMART_HOME, {
            commandId: DeployToEditorCommand.id,
            label: DeployToEditorCommand.label
        });
        menus.registerMenuAction(SmartHomeMenus.SMART_HOME, {
            commandId: ScaffoldingCommand.id,
            label: ScaffoldingCommand.label
        });
    }
}
