

import importFresh from 'import-fresh'
import { readdir } from 'node:fs/promises'
import { resolve, join } from 'node:path'
import { cwd } from 'node:process'
export const extractJsonFromModule = async (modulePath: string, pieceName: string, pieceVersion: string) => {
    // TODO: get node json from build module and return
    return {
        nodeProperties: {
            name: "Github",
            description: "Github",
            icon: "githubicon.svg"
        },
        actions: [{
            actionProperties: {
                name: "GithubCloseCommit",
                description: "GithubCloseCommit",
                icon: "githubicon.svg"
            }
        }]

    }

}



