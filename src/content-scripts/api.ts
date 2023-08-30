import { Readability } from "@mozilla/readability"
import { parseHTML } from "linkedom"
import Browser from "webextension-polyfill"
import { SearchResult } from "./web_search"
import { getUserConfig } from "src/util/userConfig"


const cleanText = (text: string) =>
    text.trim()
        .replace(/(\n){4,}/g, "\n\n\n")
        // .replace(/\n\n/g, " ")
        .replace(/ {3,}/g, "  ")
        .replace(/\t/g, "")
        .replace(/\n+(\s*\n)*/g, "\n")

export async function getWebpageTitleAndText(url: string, html_str = ''): Promise<SearchResult> {

    let html = html_str
    if (!html) {
        let response: Response
        try {
            response = await fetch(url.startsWith('http') ? url : `https://${url}`)
        } catch (e) {
            return {
                title: 'Could not fetch the page.',
                body: `Could not fetch the page: ${e}.\nMake sure the URL is correct.`,
                url
            }
        }
        if (!response.ok) {
            return {
                title: "Could not fetch the page.",
                body: `Could not fetch the page: ${response.status} ${response.statusText}`,
                url
            }
        }
        html = await response.text()
    }


    const doc = parseHTML(html).document
    const parsed = new Readability(doc).parse()

    if (!parsed || !parsed.textContent) {
        return { title: "Could not parse the page.", body: "Could not parse the page.", url }
    }
    
    let text = cleanText(parsed.textContent)

    const userConfig = await getUserConfig()
    if (userConfig.trimLongText && text.length > 14400) {
        text = text.slice(0, 14400)
        text += "\n\n[Text has been trimmed to 14,500 characters. You can disable this on WebChatGPT's options page.]"
    }
    return { title: parsed.title, body: text, url }
}

export async function apiExtractText(url: string): Promise<SearchResult[]> {
    const response = await Browser.runtime.sendMessage({
        type: "get_webpage_text",
        url
    })

    return [response]
}