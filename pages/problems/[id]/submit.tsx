import Head from 'next/head'
import Link from 'next/link'
import React from 'react'

import { useRouter } from 'next/router'

import useSWR from 'swr'
import fetcher from '../../../src/libs/fetcher'

import DefaultLayout from '../../../layouts/DeaultLayout'

import hljs from 'highlight.js'

hljs.configure({
});

export default function Submit() {
  const router = useRouter();
  const { id } = router.query;

  const codeEditor = React.createRef<HTMLTextAreaElement>();
  const codeMirror = React.createRef<HTMLDivElement>();

  const languages = [
    "c++", "java", "rust", "javascript",
    "c#", "python", "ruby", "brainfuck",
  ];

  return (
    <DefaultLayout>
      <Head>
        <title>제출</title>
      </Head>

      <form method="POST" action="/api/">
        <h1>제출</h1>

        <select name="language" className="input">
          { languages.map(lang => (
              <option value={lang} key={lang}>{lang}</option>
            )) }
        </select>

        <div className="code-wrapper">
          <textarea
            name="sourcecode"
            className="code code-editor"
            spellCheck="false"
            ref={codeEditor}
            onScroll={
              function(e: React.UIEvent<HTMLTextAreaElement, UIEvent>) {
                if (codeEditor.current && codeMirror.current) {
                  codeMirror.current.scrollTop = codeEditor.current.scrollTop;
                  codeMirror.current.scrollLeft = codeEditor.current.scrollLeft;
                }
              }
            }
            onKeyDown={
              function(e: React.KeyboardEvent<HTMLTextAreaElement>) {
                if (codeEditor.current && codeMirror.current) {
                  codeMirror.current.scrollTop = codeEditor.current.scrollTop;
                  codeMirror.current.scrollLeft = codeEditor.current.scrollLeft;
                }
                if (e.key == "Tab") {
                  e.preventDefault();

                  var { selectionStart, selectionEnd } = e.currentTarget;
                  var tabCharacter = "    ";
                  e.currentTarget.value =
                    e.currentTarget.value.slice(0, selectionStart)
                    + tabCharacter
                    + e.currentTarget.value.slice(selectionEnd);
                  e.currentTarget.setSelectionRange(
                    selectionStart + tabCharacter.length,
                    selectionStart + tabCharacter.length);
                }
              }
            }
            onKeyUp={
              function() {
                if (codeEditor.current && codeMirror.current) {
                  codeMirror.current.innerHTML =
                    hljs
                      .highlightAuto(codeEditor.current.value)
                      .value
                      .replace(/\n/g, '<br>')
                      .concat("<div> </div>"); // dummy element to make last
                                               // br element to make effects.
                  
                      codeMirror.current.scrollTop = codeEditor.current.scrollTop;
                      codeMirror.current.scrollLeft = codeEditor.current.scrollLeft;
                }
              }
            }
          >
          </textarea>

          <pre style={ ({margin: '0'}) }>
            <code className="code code-mirror" ref={codeMirror}>
            </code>
          </pre>
        </div>

        <button className="submit" type="submit">제출</button>
      </form>

      <style jsx>{`
      .code-wrapper {
        position: relative;
      }
      .code {
        width: 100%;
        height: 500px;
        padding: 10px;
        font-family: 'Consolas', monospace;
        border: 1px solid #dddddd;
        border-radius: 5px;
        font-size: 10pt;
        resize: none;
        overflow: auto;
      }
      .code-editor {
        color: white;
        caret-color: black;
        white-space: nowrap;
      }
      .code-mirror {
        position: absolute;
        top: 0;
        pointer-events: none;
      }
      .submit {
        border: 1px solid #dddddd;
        border-radius: 5px;
        padding: 5px 40px;
        margin: 10px 0;
        cursor: pointer;
      }
      .input {
        padding: 5px 10px;
        border: 1px solid #dddddd;
        border-radius: 5px;
        font-size: 1rem;
        margin: 10px 0;
      }
      `}</style>
    </DefaultLayout>
  );
}