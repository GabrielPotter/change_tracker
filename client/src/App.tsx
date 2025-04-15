import { useState } from 'react';
import './App.css';

type FileData = {
  name: string;
  content: string;
};

type EditorSectionProps = {
  title: string;
  initialFiles: FileData[];
  onCreate?: () => void;
  onDelete?: (file: FileData) => void;
  onSave?: (file: FileData) => void;
};

const EditorSection = ({ title, initialFiles, onCreate, onDelete, onSave }: EditorSectionProps) => {
  const [files, setFiles] = useState<FileData[]>(initialFiles);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [editMode, setEditMode] = useState(false);

  const selectedFile = files[selectedIndex];

  const handleChange = (value: string) => {
    const updated = [...files];
    updated[selectedIndex].content = value;
    setFiles(updated);
  };

  const handleCreate = () => {
    if (onCreate) onCreate();
    const newFile = { name: `new-${Date.now()}.json`, content: '{}' };
    setFiles([...files, newFile]);
    setSelectedIndex(files.length);
    setEditMode(true);
  };

  const handleDelete = () => {
    if (onDelete) onDelete(selectedFile);
    const updated = files.filter((_, i) => i !== selectedIndex);
    setFiles(updated);
    setSelectedIndex(Math.max(0, selectedIndex - 1));
    setEditMode(false);
  };

  const handleSave = () => {
    if (onSave) onSave(selectedFile);
    setEditMode(false);
  };

  return (
    <div className="editor-section">
      <div className="editor-title">{title}</div>
      <div className="editor-content">
        <div className="file-list">
          {files.map((file, idx) => (
            <div
              key={file.name}
              className={`file-item ${idx === selectedIndex ? 'selected' : ''}`}
              onClick={() => {
                setSelectedIndex(idx);
                setEditMode(false);
              }}
            >
              {file.name}
            </div>
          ))}
        </div>
        <textarea
          className="json-editor"
          value={selectedFile?.content}
          onChange={(e) => handleChange(e.target.value)}
          disabled={!editMode}
        />
      </div>
      <div className="button-row">
        <button onClick={handleCreate}>Create</button>
        <button onClick={() => setEditMode(true)}>Edit</button>
        <button onClick={handleDelete}>Delete</button>
        <button onClick={handleSave}>Save</button>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <div className="app-container">
      <h1 className="title">Management Console</h1>

      <div className="info-area">
        <div className="info-item">
          <label>Info 1:</label>
          <span>Status OK</span>
        </div>
        <div className="info-item">
          <label>Info 2:</label>
          <span>Last Sync: Today</span>
        </div>
        <div className="info-item">
          <label>Info 3:</label>
          <span>Online</span>
        </div>
      </div>

      <div className="editor-grid">
        <EditorSection
          title="Config Files"
          initialFiles={[
            { name: 'config-prod.json', content: '{ "env": "production" }' },
            { name: 'config-dev.json', content: '{ "env": "development" }' },
          ]}
          onCreate={() => console.log('[Config] Create')}
          onDelete={(file) => console.log('[Config] Delete', file.name)}
          onSave={(file) => console.log('[Config] Save', file.name)}
        />

        <EditorSection
          title="User Data"
          initialFiles={[
            { name: 'admin.json', content: '{ "role": "admin" }' },
            { name: 'guest.json', content: '{ "role": "guest" }' },
          ]}
          onCreate={() => console.log('[Users] Create')}
          onDelete={(file) => console.log('[Users] Delete', file.name)}
          onSave={(file) => console.log('[Users] Save', file.name)}
        />

        <EditorSection
          title="Logs"
          initialFiles={[
            { name: 'error-log.json', content: '{ "errors": [] }' },
            { name: 'debug-log.json', content: '{ "debug": true }' },
          ]}
          onCreate={() => console.log('[Logs] Create')}
          onDelete={(file) => console.log('[Logs] Delete', file.name)}
          onSave={(file) => console.log('[Logs] Save', file.name)}
        />
      </div>
    </div>
  );
};

export default App;
