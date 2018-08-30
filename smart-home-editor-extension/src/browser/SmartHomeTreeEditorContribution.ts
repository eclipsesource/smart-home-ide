import { TheiaTreeEditorContribution } from "theia-tree-editor";
import { inject } from "inversify";
import {WidgetManager} from "@theia/core/lib/browser";
import { MessageService, SelectionService } from "@theia/core";
import { FileDownloadService } from "@theia/filesystem/lib/browser/download/file-download-service";
import URI from '@theia/core/lib/common/uri';

export class SmartHomeTreeEditorContribution extends TheiaTreeEditorContribution {
    
    constructor(
        @inject(WidgetManager) widgetManager: WidgetManager,
        @inject(MessageService) messageService: MessageService,
        @inject(SelectionService) selectionService: SelectionService,
        @inject(FileDownloadService) fileDownloadService: FileDownloadService
      ) {
        super(widgetManager, messageService, selectionService, fileDownloadService);
      }

      canHandle(uri: URI): number {
        if (uri.path.ext === '.ad') {
          return 1000;
        }
        return 0;
      }
}