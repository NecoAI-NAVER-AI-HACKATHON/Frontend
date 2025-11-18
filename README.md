# Installation
1. Clone the repository:
```
git clone https://github.com/NecoAI-NAVER-AI-HACKATHON/Frontend.git
cd frontend
```
2. Install dependencies:
```
npm install -f
```
3. Running the App in Development
```
npm run dev
```
Then open your browser at:
```
http://localhost:5173/
```

## Mock Context System

The application uses a mock context system with localStorage persistence to simulate database behavior. This allows you to develop and test the application without a backend API.

### Overview

The mock context system consists of three main contexts:
- **WorkspacesContext**: Manages workspaces
- **SystemsContext**: Manages systems (workflows)
- **WorkflowsContext**: Manages workflow definitions and canvas data

All data is automatically persisted to localStorage and loaded on app startup.

### Available Contexts

#### 1. WorkspacesContext

Manages workspace data with localStorage persistence.

**Usage:**
```typescript
import { useWorkspaces } from "@/contexts/WorkspacesContext";

const MyComponent = () => {
  const { 
    workspaces, 
    getWorkspace, 
    createWorkspace, 
    updateWorkspace, 
    deleteWorkspace,
    isLoading 
  } = useWorkspaces();

  // Get a specific workspace
  const workspace = getWorkspace("ws-001");

  // Create a new workspace
  const newId = createWorkspace({
    name: "My Workspace",
    description: "Workspace description",
    status: "active",
    user_id: "user-001",
  });

  // Update a workspace
  updateWorkspace({
    id: "ws-001",
    name: "Updated Name",
    description: "Updated description",
    status: "active",
    systems_count: 5,
    user_id: "user-001",
    created_at: "...",
    updated_at: "...",
  });

  // Delete a workspace
  deleteWorkspace("ws-001");
};
```

**Mock Data:**
- Initializes with 3 mock workspaces on first load
- Stored in localStorage under key: `workspaces_storage`

#### 2. SystemsContext

Manages system (workflow) data with localStorage persistence. Systems are linked to workflows - each system has a corresponding workflow.

**Usage:**
```typescript
import { useSystems } from "@/contexts/SystemsContext";

const MyComponent = () => {
  const { 
    systems, 
    getSystem, 
    getSystemsByWorkspace,
    createSystem, 
    updateSystem, 
    deleteSystem,
    isLoading 
  } = useSystems();

  // Get a specific system
  const system = getSystem("sys-001");

  // Get all systems in a workspace
  const workspaceSystems = getSystemsByWorkspace("ws-001");

  // Create a new system
  const newId = createSystem({
    name: "My System",
    description: "System description",
    workspace_id: "ws-001",
  });

  // Update a system
  updateSystem({
    id: "sys-001",
    name: "Updated Name",
    description: "Updated description",
    workspace_id: "ws-001",
    nodes_count: 10,
    created_at: "...",
    updated_at: "...",
  });

  // Delete a system
  deleteSystem("sys-001");
};
```

**Mock Data:**
- Initializes with 6 mock systems across 3 workspaces on first load
- Stored in localStorage under key: `systems_storage`
- System IDs are used as workflow IDs (systems are workflows)

#### 3. WorkflowsContext

Manages workflow canvas data (nodes, connections) with localStorage persistence.

**Usage:**
```typescript
import { useWorkflows } from "@/contexts/WorkflowsContext";

const MyComponent = () => {
  const { 
    workflows, 
    getWorkflow, 
    createWorkflow, 
    saveWorkflow, 
    deleteWorkflow,
    isLoading 
  } = useWorkflows();

  // Get a specific workflow
  const workflow = getWorkflow("sys-001"); // System ID = Workflow ID

  // Create a new workflow
  const newId = createWorkflow({
    name: "My Workflow",
    nodes: [],
    connections: [],
  });

  // Create workflow with specific ID (for systems)
  createWorkflow({
    id: "sys-001", // Use system ID
    name: "System Workflow",
    nodes: [],
    connections: [],
  });

  // Save/update a workflow
  saveWorkflow({
    id: "sys-001",
    name: "Updated Workflow",
    nodes: [...],
    connections: [...],
  });

  // Delete a workflow
  deleteWorkflow("sys-001");
};
```

**Mock Data:**
- Stored in localStorage under key: `workflows_storage`
- Workflows are automatically created when opening a system

### System-Workflow Linking

**Important:** Systems and Workflows are linked by ID. When you create a system, its ID becomes the workflow ID.

1. **Creating a System**: When you create a system with ID `sys-001`, it automatically gets a corresponding workflow
2. **Opening a System**: When you navigate to `/workspaces/:workspaceId/systems/:systemId/workflow`, the workflow is automatically created/loaded
3. **Workflow ID**: The workflow ID matches the system ID

**Example:**
```typescript
// Create a system
const systemId = createSystem({
  name: "Daily Feedback Processor",
  workspace_id: "ws-001",
});

// Later, when opening the workflow, it uses the same ID
// The workflow will be created with id = systemId
```

### Navigation Flow

The application supports the following navigation hierarchy:

1. **Workspaces** (`/workspaces`)
   - Lists all workspaces
   - Click a workspace → Workspace Detail

2. **Workspace Detail** (`/workspaces/:id`)
   - Shows Systems, Models, Logs, Chatbot tabs
   - Click a system → Workflow Canvas

3. **Workflow Canvas** (`/workspaces/:workspaceId/systems/:systemId/workflow`)
   - Visual workflow editor
   - Back button returns to workspace
   - Breadcrumbs show: Workspace → System → Workflow Name

### Using Contexts in Components

**Example: Using WorkspacesContext in a component**
```typescript
import { useWorkspaces } from "@/contexts/WorkspacesContext";

const WorkspacesList = () => {
  const { workspaces, isLoading } = useWorkspaces();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {workspaces.map(workspace => (
        <div key={workspace.id}>{workspace.name}</div>
      ))}
    </div>
  );
};
```

**Example: Using SystemsContext with Workspace filtering**
```typescript
import { useSystems } from "@/contexts/SystemsContext";
import { useParams } from "react-router-dom";

const SystemsList = () => {
  const { id: workspaceId } = useParams<{ id: string }>();
  const { getSystemsByWorkspace, isLoading } = useSystems();

  const systems = getSystemsByWorkspace(workspaceId || "");

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {systems.map(system => (
        <div key={system.id}>{system.name}</div>
      ))}
    </div>
  );
};
```

### localStorage Structure

Data is stored in localStorage with the following keys:
- `workspaces_storage`: Array of workspace objects
- `systems_storage`: Array of system objects
- `workflows_storage`: Array of workflow objects

**Clearing Mock Data:**
To reset all mock data, clear localStorage:
```javascript
// In browser console
localStorage.removeItem('workspaces_storage');
localStorage.removeItem('systems_storage');
localStorage.removeItem('workflows_storage');
// Refresh the page to reload mock data
```

### Auto-Save Behavior

- **Workspaces**: Automatically saved to localStorage when created/updated/deleted
- **Systems**: Automatically saved to localStorage when created/updated/deleted
- **Workflows**: Automatically saved when nodes are added/modified/deleted (via WorkflowContext)

### Integration with Services

The service layer (`src/lib/services/`) checks contexts first, then falls back to API calls:

```typescript
// WorkspaceService checks WorkspacesContext first
const response = await WorkspaceService.getAllWorkspaces();
// Returns context data if available, otherwise calls API
```

This allows the app to work with mock data during development and seamlessly switch to real API calls when available.

### Best Practices

1. **Always check isLoading**: Use the `isLoading` flag to show loading states
2. **Use context hooks**: Prefer context hooks over direct service calls when possible
3. **System IDs**: When creating systems, remember they become workflow IDs
4. **Workspace filtering**: Use `getSystemsByWorkspace()` to filter systems by workspace
5. **Error handling**: Wrap context operations in try-catch blocks for error handling
