'use client';

import Tiptap from '@/components/Tiptap/Tiptap';
import { uploadFile } from '@/lib/uploadFile';
import { useState } from 'react';
import { Content } from '@tiptap/react';

export default function TiptapExamplePage() {
    const [content, setContent] = useState<Content>({
        type: 'doc',
        content: [
            {
                type: 'paragraph',
            },
        ],
    });

    const handleUpdate = (newContent: Content) => {
        setContent(newContent);
        console.log('Content updated:', newContent);
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">TipTap 에디터 예제</h1>
            <div className="border rounded-lg">
                <Tiptap
                    id="example-editor"
                    defaultContent={content}
                    onUpdate={handleUpdate}
                    uploadFile={uploadFile}
                    className="min-h-[400px] p-4"
                />
            </div>
            <div className="mt-4">
                <h2 className="text-lg font-semibold mb-2">JSON 출력:</h2>
                <pre className="bg-muted p-4 rounded-lg text-xs overflow-auto max-h-[200px]">
                    {JSON.stringify(content, null, 2)}
                </pre>
            </div>
        </div>
    );
}
