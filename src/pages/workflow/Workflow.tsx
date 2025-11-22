import { useState, useCallback, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import WorkflowNav from "../../components/workflow/WorkflowNav";
import NodeBarSection from "../../components/workflow/NodeBarSection";
import NodeConfigSection from "../../components/workflow/NodeConfigSection/index";
import CanvasSection from "../../components/workflow/CanvasSection";
import LogSection from "../../components/workflow/LogSection";
import VariablesSidebar from "../../components/workflow/VariablesSidebar";
import { ExecutionService } from "../../lib/services/executionService";
import { MOCK_EXECUTION_OUTPUT } from "../../mockdata/MockExecutionOutput";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { WorkflowProvider, useWorkflow } from "../../contexts/WorkflowContext";
import { useWorkflows } from "../../contexts/WorkflowsContext";
import { useSystems } from "../../contexts/SystemsContext";
import type {
  WorkflowNode,
  NodeDefinition,
  ExecutionLog,
  Workflow,
  CustomVariable,
} from "../../types/workflow";
import {
  mockWorkflowId,
  mockWorkflow,
  mockWorkflowNodes,
  mockExecutionLogs,
  mockWorkflowVariables,
} from "../../mockdata/WorkflowData";


interface WorkflowContentProps {
  workspaceId?: string;
  systemId?: string;
}

const WorkflowContent = ({ workspaceId, systemId }: WorkflowContentProps) => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const workflowId = systemId || id;
  const isMockWorkflow = workflowId === mockWorkflowId;
  const { workflow } = useWorkflow();
  const { deleteWorkflow: deleteWorkflowFromStorage, saveWorkflow: saveToStorage, revertMockWorkflow } = useWorkflows();
  
  const workflowName = workflow?.name || (isMockWorkflow ? mockWorkflow.name : id || "New Workflow");

  // Use workflow context
  const {
    nodes,
    logs,
    selectedNodeId,
    setNodes,
    setLogs,
    setSelectedNodeId,
    updateNode,
    addNode,
    deleteNode,
    addLog,
    updateWorkflowVariables,
  } = useWorkflow();

  const [selectedNodeType, setSelectedNodeType] = useState<string | undefined>(
    undefined
  );
  const [showConfig, setShowConfig] = useState(false);
  const [showVariables, setShowVariables] = useState(false);
  const [showLoadMockDialog, setShowLoadMockDialog] = useState(false);
  const [showRevertDialog, setShowRevertDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [variables, setVariables] = useState<CustomVariable[]>(
    workflow?.variables || []
  );
  // Store execution output data (for mock workflow)
  const [executionOutput, setExecutionOutput] = useState<any[]>([]);
  
  useEffect(() => {
    if (executionOutput.length > 0) {
      executionOutputRef.current = executionOutput;
    } else if (executionOutputRef.current.length > 0 && isMockWorkflow) {
      setExecutionOutput([...executionOutputRef.current]);
    }
  }, [executionOutput, isMockWorkflow]);

  const initializedWorkflowId = useRef<string | null>(null);
  const workflowNodesRef = useRef<WorkflowNode[]>([]);
  const executionOutputRef = useRef<any[]>([]);
  
  useEffect(() => {
    if (executionOutput.length > 0) {
      executionOutputRef.current = executionOutput;
    }
  }, [executionOutput]);

  useEffect(() => {
    const currentWorkflowId = workflow?.id || (isMockWorkflow ? mockWorkflowId : null);
    
    if (currentWorkflowId !== initializedWorkflowId.current) {
      setExecutionOutput([]);
      executionOutputRef.current = [];
      
      if (isMockWorkflow) {
        const workflowToUse = workflow || mockWorkflow;
        const nodesToUse = workflowToUse.nodes && workflowToUse.nodes.length > 0 
          ? workflowToUse.nodes 
          : mockWorkflowNodes;
        const variablesToUse = workflowToUse.variables || mockWorkflow.variables || [];
        
        setNodes(nodesToUse);
        workflowNodesRef.current = nodesToUse;
        setLogs(mockExecutionLogs);
        setVariables(variablesToUse);
        if (nodesToUse.length > 0) {
          setSelectedNodeId(nodesToUse[0].id);
          setSelectedNodeType(nodesToUse[0].type);
          setShowConfig(true);
        }
        initializedWorkflowId.current = mockWorkflowId;
      } else if (workflow) {
        if (workflow.nodes && workflow.nodes.length > 0) {
          setNodes(workflow.nodes);
          workflowNodesRef.current = workflow.nodes;
          if (workflow.nodes.length > 0) {
            setSelectedNodeId(workflow.nodes[0].id);
            setSelectedNodeType(workflow.nodes[0].type);
          }
        } else {
          setNodes([]);
          workflowNodesRef.current = [];
          setSelectedNodeId(null);
        }
        setVariables(workflow.variables || []);
        setExecutionOutput([]);
        executionOutputRef.current = [];
        initializedWorkflowId.current = currentWorkflowId;
      } else if (!workflow && !isMockWorkflow) {
        setNodes([]);
        workflowNodesRef.current = [];
        setLogs([]);
        setVariables([]);
        setExecutionOutput([]);
        executionOutputRef.current = [];
        setSelectedNodeId(null);
        setShowConfig(false);
        initializedWorkflowId.current = null;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workflow?.id, isMockWorkflow]);

  useEffect(() => {
    if (workflow && updateWorkflowVariables) {
      const variablesChanged = JSON.stringify(workflow.variables || []) !== JSON.stringify(variables);
      if (variablesChanged) {
        updateWorkflowVariables(variables);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variables, updateWorkflowVariables]);

  const handleNodeSelect = useCallback((nodeDef: NodeDefinition) => {
    setSelectedNodeType(nodeDef.type);
    // Add new node to canvas with better positioning
      const defaultConfig = nodeDef.defaultConfig || { name: nodeDef.label };
      // Ensure parameters object always exists
      if (!defaultConfig.parameters) {
        defaultConfig.parameters = {};
      }

    const newNode: WorkflowNode = {
      id: `node-${Date.now()}`,
      type: nodeDef.type,
      name: nodeDef.label,
      position: {
        // Place new nodes in a grid-like pattern
        x: 300 + (nodes.length % 3) * 250,
        y: 150 + Math.floor(nodes.length / 3) * 150,
      },
        config: defaultConfig,
    };
    addNode(newNode);
    setSelectedNodeId(newNode.id);
    setShowConfig(true);
  }, [nodes.length, addNode, setSelectedNodeId]);

  const handleNodeClick = useCallback((nodeId: string | null) => {
    setSelectedNodeId(nodeId);
    setShowConfig(nodeId !== null);
  }, [setSelectedNodeId]);

  const handleNodeUpdate = useCallback(
    (nodeId: string, updates: Partial<WorkflowNode>) => {
      updateNode(nodeId, updates);
    },
    [updateNode]
  );

  const handleNodeDelete = useCallback((nodeId: string) => {
    deleteNode(nodeId);
    
    // Clear selection if deleted node was selected
    if (selectedNodeId === nodeId) {
      setSelectedNodeId(null);
      setShowConfig(false);
    }
  }, [selectedNodeId, deleteNode, setSelectedNodeId]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === "Delete" || e.key === "Backspace") && selectedNodeId) {
        const target = e.target as HTMLElement;
        if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) {
          return;
        }
        
        e.preventDefault();
        handleNodeDelete(selectedNodeId);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedNodeId, handleNodeDelete]);

  const handleConfigChange = useCallback(
    (nodeId: string, config: Record<string, any>) => {
      const updates: Partial<WorkflowNode> = { config };
      if (config.name) {
        updates.name = config.name;
      }
      handleNodeUpdate(nodeId, updates);
    },
    [handleNodeUpdate]
  );

  const getNodeTypeMapping = (node: WorkflowNode) => {
    if (node.config?.type && node.config?.subtype) {
      return {
        type: node.config.type,
        subtype: node.config.subtype,
      };
    }
    
    const typeMap: Record<string, { type: string; subtype: string }> = {
      schedule: { type: "trigger", subtype: "schedule" },
      webhook: { type: "trigger", subtype: "webhook" },
      manual: { type: "trigger", subtype: "manual" },
      "file-upload": { type: "trigger", subtype: "file-upload" },
      "form-submit": { type: "trigger", subtype: "form-submit" },
      // AI Processing
      hyperclova: { type: "ai-processing", subtype: "hyperclova" },
      "clova-ocr": { type: "ai-processing", subtype: "clova-ocr" },
      "clova-studio": { type: "ai-processing", subtype: "clova-studio" },
      papago: { type: "ai-processing", subtype: "papago" },
      "custom-model": { type: "ai-processing", subtype: "custom-model" },
      // Transform
      function: { type: "data-transform", subtype: "function" },
      split: { type: "data-transform", subtype: "split" },
      merge: { type: "data-transform", subtype: "merge" },
      format: { type: "data-transform", subtype: "format" },
      // Control
      "if-else": { type: "control", subtype: "if" },
      loop: { type: "control", subtype: "loop" },
      switch: { type: "control", subtype: "switch" },
      // Output
      "http-request": { type: "output", subtype: "http-request" },
      database: { type: "output", subtype: "database-writer" },
      email: { type: "output", subtype: "mail-writer" },
      "webhook-response": { type: "output", subtype: "webhook-response" },
    };
    
    return typeMap[node.type] || { type: node.type, subtype: node.type };
  };

  const handleRun = async () => {
    if (isRunning) {
      toast.warning("Workflow is already running");
      return;
    }

    // Get system ID - use specific ID for mock workflow, otherwise use systemId from route or workflow ID as fallback
    const MOCK_SYSTEM_ID = "ab9d7305-d11a-419e-8216-f1727534adb7";
    const systemIdToUse = isMockWorkflow ? MOCK_SYSTEM_ID : (systemId || workflowId);
    
    if (!systemIdToUse) {
      toast.error("Cannot run workflow: No system ID found");
      return;
    }

    setIsRunning(true);
    
    try {
      // Convert workflow to backend JSON format
      const workflowJson = {
        id: isMockWorkflow ? MOCK_SYSTEM_ID : (workflow?.id || mockWorkflowId),
        name: workflow?.name || "Daily Feedback Batch Processor",
        nodes: nodes.map((node) => {
          const typeMapping = getNodeTypeMapping(node);
          const nodeJson: any = {
            name: node.config?.name || node.name,
            type: node.config?.type || typeMapping.type,
            subtype: node.config?.subtype || typeMapping.subtype,
            position: [node.position.x, node.position.y],
            parameters: node.config?.parameters || {},
          };
          
          // Add inputSchema if it exists in config
          if (node.config?.inputSchema) {
            nodeJson.inputSchema = node.config.inputSchema;
          }
          
          // Add outputSchema if it exists in config
          if (node.config?.outputSchema) {
            nodeJson.outputSchema = node.config.outputSchema;
          }
          
          return nodeJson;
        }),
        connections: buildConnectionsArray(nodes),
      };
      
      let executionId: string;
      
      if (isMockWorkflow) {
        toast.loading("Creating execution...", { id: "execution-loading" });
        
        executionId = MOCK_SYSTEM_ID;
        
        toast.loading("Starting workflow execution...", { id: "execution-loading" });
        
        await ExecutionService.startExecution(executionId);
        
        const mockOutput = Array.isArray(MOCK_EXECUTION_OUTPUT) ? [...MOCK_EXECUTION_OUTPUT] : [];
        executionOutputRef.current = mockOutput;
        setExecutionOutput(mockOutput);
      } else {
        toast.loading("Creating execution...", { id: "execution-loading" });
        const execution = await ExecutionService.createExecution({
          system_id: systemIdToUse,
          system_json: workflowJson,
          status: "running",
        });
        
        executionId = execution.id;
        
        toast.loading("Starting workflow execution...", { id: "execution-loading" });
        
        await ExecutionService.startExecution(executionId);
        
        setTimeout(async () => {
          try {
            const executionResult = await ExecutionService.getExecution(executionId);
            if (executionResult.logs) {
              try {
                const logsData = typeof executionResult.logs === "string" 
                  ? JSON.parse(executionResult.logs) 
                  : executionResult.logs;
                if (Array.isArray(logsData) && logsData.length > 0) {
                  setExecutionOutput(logsData);
                  executionOutputRef.current = logsData;
                }
              } catch (parseError) {
                // Error parsing execution logs
              }
            }
          } catch (fetchError) {
            // Error fetching execution output
          }
        }, 3000);
      }
      
      // Success - add log and show toast
      const newLog: ExecutionLog = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
        message: `Workflow execution started successfully (Execution ID: ${executionId})`,
        status: "success",
      };
      addLog(newLog);
      
      toast.success("Workflow execution started successfully!", {
        id: "execution-loading",
        description: `Execution ID: ${executionId} - Check Output tab for execution results`,
      });
    } catch (error: any) {
      // Add error log
      const errorLog: ExecutionLog = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
        message: `Workflow execution failed: ${error.message || "Unknown error"}`,
        status: "error",
      };
      addLog(errorLog);
      
      toast.error("Failed to start workflow execution", {
        id: "execution-loading",
        description: error.message || "Please try again.",
      });
    } finally {
      setIsRunning(false);
    }
  };

  // Helper function to build connections array in the format: [{ main: [[{sourceNode, targetNode, inputIndex}]] }]
  const buildConnectionsArray = (workflowNodes: WorkflowNode[]) => {
    const connections: any[] = [];
    const nodeNameMap = new Map<string, string>(); // Map node ID to node name
    
    // Build node name map
    workflowNodes.forEach((node) => {
      nodeNameMap.set(node.id, node.config?.name || node.name);
    });
    
    // Group connections by source node
    const connectionsBySource = new Map<string, Array<{ sourceNode: string; targetNode: string; inputIndex: number }>>();
    
    workflowNodes.forEach((node) => {
      if (node.connections?.output) {
        node.connections.output.forEach((targetId) => {
          const sourceName = nodeNameMap.get(node.id) || node.id;
          const targetName = nodeNameMap.get(targetId) || targetId;
          
          if (!connectionsBySource.has(sourceName)) {
            connectionsBySource.set(sourceName, []);
          }
          
          connectionsBySource.get(sourceName)!.push({
            sourceNode: sourceName,
            targetNode: targetName,
            inputIndex: 0, // Default to 0, can be enhanced later
          });
        });
      }
    });
    
    // Build connections array structure
    connectionsBySource.forEach((conns) => {
      // Check if any target is "End Node" (special case for if-else)
      const mainConnections: any[] = [];
      const subConnections: any[] = [];
      
      conns.forEach((conn) => {
        if (conn.targetNode === "End Node") {
          subConnections.push(conn);
        } else {
          mainConnections.push(conn);
        }
      });
      
      const connectionGroup: any = {};
      if (mainConnections.length > 0) {
        connectionGroup.main = [mainConnections];
      }
      if (subConnections.length > 0) {
        connectionGroup.sub = [subConnections];
      }
      
      if (Object.keys(connectionGroup).length > 0) {
        connections.push(connectionGroup);
      }
    });
    
    return connections;
  };

  const handleVariablesChange = useCallback((newVariables: CustomVariable[]) => {
    setVariables(newVariables);
    // Variables will be saved when user clicks Save button
  }, []);

  const handleSave = () => {
    // Save workflow to localStorage with variables and system_id
    const workflowIdToSave = systemId || workflowId || workflow?.id;
    
    if (workflowIdToSave) {
      // Update workflow with current nodes, variables, and system_id before saving
      const workflowToSave: Workflow = {
        id: workflowIdToSave,
        name: workflow?.name || workflowName,
        nodes: nodes,
        connections: nodes.reduce((acc, node) => {
          if (node.connections?.output) {
            node.connections.output.forEach((targetId) => {
              acc.push({ from: node.id, to: targetId });
            });
          }
          return acc;
        }, [] as Array<{ from: string; to: string }>),
        variables: variables,
      };
      
      // Save to WorkflowsContext (which saves to localStorage)
      saveToStorage(workflowToSave);
      toast.success("Workflow saved successfully!");
    } else {
      toast.error("No workflow to save.");
    }
  };

  const handleRevert = () => {
    if (isMockWorkflow) {
      setShowRevertDialog(true);
    }
  };

  const confirmRevert = () => {
        revertMockWorkflow();
    setShowRevertDialog(false);
        // Reload the page to refresh the workflow
        window.location.reload();
  };

  const handleLoadMock = () => {
    // Open dialog instead of using confirm()
    setShowLoadMockDialog(true);
  };

  const confirmLoadMock = () => {
    // Load mock workflow nodes, connections, and variables
    setNodes(mockWorkflowNodes);
    workflowNodesRef.current = mockWorkflowNodes;
    setLogs(mockExecutionLogs);
    const variablesToLoad = mockWorkflow.variables || mockWorkflowVariables;
    setVariables(variablesToLoad);
    
    // Update workflow state if it exists
    if (workflow) {
      // Update local workflow variables state
      updateWorkflowVariables(variablesToLoad);
    }
    
    // Select first node if available
    if (mockWorkflowNodes.length > 0) {
      setSelectedNodeId(mockWorkflowNodes[0].id);
      setSelectedNodeType(mockWorkflowNodes[0].type);
      setShowConfig(true);
    }
    
    // Close dialog and show success message
    setShowLoadMockDialog(false);
    toast.success("Mock workflow template loaded successfully!");
  };

  const handleDelete = () => {
    // Delete workflow from localStorage
    const workflowIdToDelete = systemId || id;
    if (workflowIdToDelete && !isMockWorkflow) {
      setShowDeleteDialog(true);
    } else if (isMockWorkflow) {
      toast.error("Cannot delete mock workflow.");
    } else {
      toast.error("No workflow to delete.");
    }
  };

  const confirmDelete = () => {
    const workflowIdToDelete = systemId || id;
    if (workflowIdToDelete && !isMockWorkflow) {
        deleteWorkflowFromStorage(workflowIdToDelete);
      setShowDeleteDialog(false);
      toast.success("Workflow deleted successfully!");
        // Navigate back to workspace or systems page
        if (workspaceId && systemId) {
          navigate(`/workspaces/${workspaceId}`);
        } else {
          navigate("/workspaces");
        }
    }
  };

  const selectedNode = nodes.find((node) => node.id === selectedNodeId) || null;

  return (
    <div className="flex flex-col h-screen bg-white">
        {/* Top Navigation */}
        <WorkflowNav
          workflowName={workflowName}
          workspaceId={workspaceId}
          systemId={systemId}
          onRun={handleRun}
          onSave={handleSave}
          onDelete={handleDelete}
          onVariablesToggle={() => setShowVariables(!showVariables)}
          showVariables={showVariables}
          onRevert={handleRevert}
          isMockWorkflow={isMockWorkflow}
          onLoadMock={handleLoadMock}
          isRunning={isRunning}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar - Node Library */}
          <NodeBarSection
            selectedNodeType={selectedNodeType}
            onNodeSelect={handleNodeSelect}
          />

          {/* Center - Canvas */}
          <div className="flex-1 flex flex-col">
            <CanvasSection
              nodes={nodes}
              selectedNodeId={selectedNodeId}
              onNodeSelect={handleNodeClick}
              onNodeUpdate={handleNodeUpdate}
              onNodeDelete={handleNodeDelete}
              onNodeAdd={(newNode) => {
                addNode(newNode);
                setSelectedNodeId(newNode.id);
                setSelectedNodeType(newNode.type);
                setShowConfig(true);
              }}
            />

            {/* Bottom - Execution Logs */}
            <LogSection
              logs={logs}
            />
          </div>

          {/* Right Sidebar - Node Configuration or Variables */}
          {showVariables && (
            <VariablesSidebar
              variables={variables}
              onVariablesChange={handleVariablesChange}
              onClose={() => setShowVariables(false)}
            />
          )}
          {showConfig && selectedNode && !showVariables && (
            <NodeConfigSection
              node={selectedNode}
              nodes={nodes}
              onClose={() => {
                setShowConfig(false);
                setSelectedNodeId(null);
              }}
              onConfigChange={handleConfigChange}
              variables={variables}
              onVariablesChange={handleVariablesChange}
            />
          )}
        </div>

        {/* Load Mock Workflow Dialog */}
        <Dialog open={showLoadMockDialog} onOpenChange={setShowLoadMockDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Load the mock workflow template?</DialogTitle>
              <DialogDescription>
                This will replace your current workflow with the Daily Feedback Batch Processor template.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowLoadMockDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={confirmLoadMock}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Load Template
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Revert Workflow Dialog */}
        <Dialog open={showRevertDialog} onOpenChange={setShowRevertDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Revert mock workflow?</DialogTitle>
              <DialogDescription>
                Are you sure you want to revert the mock workflow to its original state? This will discard all changes saved in localStorage.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowRevertDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={confirmRevert}
                variant="destructive"
              >
                Revert
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Workflow Dialog */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete workflow?</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this workflow? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowDeleteDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={confirmDelete}
                variant="destructive"
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
    </div>
  );
};

const Workflow = () => {
  const { id, workspaceId, systemId } = useParams<{ 
    id?: string; 
    workspaceId?: string; 
    systemId?: string; 
  }>();
  const { getWorkflow, createWorkflow, saveWorkflow } = useWorkflows();
  const { getSystem } = useSystems();
  const [initialWorkflow, setInitialWorkflow] = useState<Workflow | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  
  // Determine workflow ID - use systemId if available, otherwise use id
  const workflowId = systemId || id;
  const isMockWorkflow = workflowId === mockWorkflowId;

  useEffect(() => {
    const loadWorkflow = async () => {
      setIsLoading(true);
      
      try {
        if (isMockWorkflow) {
          // Load mock workflow (sys-001) - check if saved version exists first
          const savedMockWorkflow = getWorkflow(mockWorkflowId);
          // Always ensure mock workflow is available, even if not in storage yet
          const workflowToLoad = savedMockWorkflow || mockWorkflow;
          setInitialWorkflow(workflowToLoad);
        } else if (systemId && workspaceId) {
          // Load from system - get system data and create/load workflow
          const system = getSystem(systemId);
          const savedWorkflow = getWorkflow(systemId);
          
          if (savedWorkflow) {
            setInitialWorkflow(savedWorkflow);
          } else {
            // Create new workflow for this system using system name
            const workflowName = system?.name || `System ${systemId}`;
            createWorkflow({
              id: systemId, // Use system ID as workflow ID
              name: workflowName,
              nodes: [],
              connections: [],
            });
            const created = getWorkflow(systemId);
            setInitialWorkflow(created);
          }
        } else if (workflowId) {
          // Try to load from localStorage
          const savedWorkflow = getWorkflow(workflowId);
          if (savedWorkflow) {
            setInitialWorkflow(savedWorkflow);
          } else {
            // Create new workflow if not found
            const newId = createWorkflow({
              name: workflowId || "New Workflow",
              nodes: [],
              connections: [],
            });
            const created = getWorkflow(newId);
            setInitialWorkflow(created);
          }
        } else {
          // No ID provided, create a new workflow
          const newId = createWorkflow({
            name: "New Workflow",
            nodes: [],
            connections: [],
          });
          const created = getWorkflow(newId);
          setInitialWorkflow(created);
        }
      } catch (error) {
        // Create a default workflow on error
        const newId = createWorkflow({
          name: "New Workflow",
          nodes: [],
          connections: [],
        });
        const created = getWorkflow(newId);
        setInitialWorkflow(created);
      } finally {
        setIsLoading(false);
      }
    };

    loadWorkflow();
  }, [id, workspaceId, systemId, isMockWorkflow, getWorkflow, createWorkflow]);

  // Handle workflow changes (only when explicitly saved)
  const handleWorkflowChange = useCallback((workflow: Workflow) => {
    if (workflow && !isMockWorkflow) {
      // This is called only when saveWorkflow is explicitly called
      saveWorkflow(workflow);
    }
  }, [saveWorkflow, isMockWorkflow]);

  if (isLoading || !initialWorkflow) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500">Loading workflow...</div>
      </div>
    );
  }

  return (
    <WorkflowProvider 
      initialWorkflow={initialWorkflow}
      onWorkflowChange={handleWorkflowChange}
    >
      <WorkflowContent workspaceId={workspaceId} systemId={systemId} />
    </WorkflowProvider>
  );
};

export default Workflow;

