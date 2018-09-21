import { injectable, inject } from "inversify";
import URI from "@theia/core/lib/common/uri";
import { FileSystem } from "@theia/filesystem/lib/common/filesystem";
import { MessageService } from "@theia/core";
import { WorkspaceService } from "@theia/workspace/lib/browser";
import * as _ from 'lodash';

@injectable()
export class CodeGenerator {

    constructor(
        @inject(FileSystem) protected readonly fileSystem: FileSystem,
        @inject(WorkspaceService) protected readonly workspaceService: WorkspaceService,
        @inject(MessageService) protected messageService: MessageService
    ) {
    }

    async readFileContent(uri: URI): Promise<string> {
        const exists = await this.fileSystem.exists(uri.toString());
        if (exists) {
            return this.fileSystem.resolveContent(uri.toString()).then(({ stat, content }) => content);
        }
        console.warn('File ' + uri.toString + ' does not exist.');
        return '';
    }

    public async generateCode(contentAsString: string, className: string): Promise<void> {
        if (contentAsString.length > 0) {
            postRequest(
                window.location.protocol + '//' + window.location.hostname + ':9091/services/java/fromXMI',
                contentAsString, 'application/xml')
                .then(response => {
                    response.text().then(java => {
                        this.workspaceService.roots.then(roots =>{
                            const workspaceLocation = new URL(roots[0].uri).pathname;

                            if (_.isEmpty(workspaceLocation)) {
                                this.messageService.error('Could not Generate Code because no workspace is open.')
                                return;
                            }
                            const javaURI = new URI(workspaceLocation + "/src/" + className.replace(/\./g, "/") + ".java")
                            this.setFileContent(javaURI, java)
                        }, () => this.messageService.error('Could not Generate Code.'))

                    },
                        () => this.messageService.error('Could not Generate Code.'))
                },
                    () => this.messageService.error('Could not Generate Code.'))

        }
    }

    async setFileContent(fileUri: URI, content: string): Promise<void> {
        const fileStat = await this.fileSystem.getFileStat(fileUri.toString());
        if (fileStat) {
            this.fileSystem.updateContent(fileStat, [{ text: content }]).then(() => Promise.resolve());
            console.log("Update content of file '" + fileUri + "'.");
        } else {
            this.fileSystem.createFile(fileUri.toString(), { content });
            console.log("Create file '" + fileUri + "'.");
        }
    }

}

function postRequest(url, data: String, contentType) {
    return fetch(url, {
        credentials: 'same-origin',
        method: 'POST',
        body: String(data),
        headers: new Headers({
            'Content-Type': contentType
        }),
    })
}