import React, { useState, useEffect } from 'react';
import { ChevronRight, Code, MessageSquare, Trophy, RefreshCw, CheckCircle, XCircle, BookOpen, Brain, Zap } from 'lucide-react';

const LangGraphInterviewBot = () => {
  const [currentSection, setCurrentSection] = useState('overview');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState(new Set());

  const interviewData = {
    conceptual: [
      {
        question: "What is LangGraph and how does it differ from traditional LLM chains?",
        answer: "LangGraph is a library for building stateful, multi-actor applications with LLMs using graph-based workflows. Unlike traditional chains that are linear, LangGraph allows for cyclic flows, conditional branching, and persistent state management. It's built on top of LangChain and provides more control over complex agent behaviors.",
        difficulty: "Medium",
        category: "Core Concepts"
      },
      {
        question: "Explain the concept of 'nodes' and 'edges' in LangGraph.",
        answer: "Nodes represent individual steps or functions in your workflow (like calling an LLM, running a tool, or processing data). Edges define the flow between nodes - they can be conditional or unconditional. Conditional edges allow dynamic routing based on the output of a node, enabling complex decision-making patterns.",
        difficulty: "Easy",
        category: "Architecture"
      },
      {
        question: "What is the StateGraph and how does state management work in LangGraph?",
        answer: "StateGraph is the main class for building stateful graphs. State is managed through a shared state object that persists across node executions. Each node can read from and write to this state. State updates are handled immutably, and you can define custom state schemas using TypedDict or Pydantic models.",
        difficulty: "Medium",
        category: "State Management"
      },
      {
        question: "How do you implement human-in-the-loop workflows in LangGraph?",
        answer: "Use the 'interrupt' functionality by setting breakpoints in your graph. You can interrupt before or after specific nodes, allow human input/review, and then resume execution. This is implemented using the 'interrupt_before' and 'interrupt_after' parameters when compiling the graph.",
        difficulty: "Hard",
        category: "Advanced Features"
      },
      {
        question: "What are the different types of edges in LangGraph?",
        answer: "1) Normal edges: Direct connections between nodes. 2) Conditional edges: Route based on node output using a condition function. 3) END edges: Terminate the graph execution. Each type serves different control flow patterns in your application.",
        difficulty: "Medium",
        category: "Control Flow"
      }
    ],
    coding: [
      {
        question: "Create a simple LangGraph that processes user input through an LLM and then formats the output.",
        answer: `from langgraph.graph import StateGraph, END
from typing import TypedDict

class GraphState(TypedDict):
    user_input: str
    llm_response: str
    formatted_output: str

def llm_node(state):
    # Simulate LLM call
    response = f"Processed: {state['user_input']}"
    return {"llm_response": response}

def format_node(state):
    formatted = f"**{state['llm_response']}**"
    return {"formatted_output": formatted}

workflow = StateGraph(GraphState)
workflow.add_node("llm", llm_node)
workflow.add_node("format", format_node)

workflow.set_entry_point("llm")
workflow.add_edge("llm", "format")
workflow.add_edge("format", END)

app = workflow.compile()`,
        difficulty: "Easy",
        category: "Basic Implementation"
      },
      {
        question: "Implement a conditional routing system that decides between different processing paths.",
        answer: `def router_node(state):
    if len(state['user_input']) > 100:
        return {"route": "complex"}
    else:
        return {"route": "simple"}

def route_condition(state):
    return state.get("route", "simple")

workflow.add_node("router", router_node)
workflow.add_node("simple_process", simple_node)
workflow.add_node("complex_process", complex_node)

workflow.add_conditional_edges(
    "router",
    route_condition,
    {
        "simple": "simple_process",
        "complex": "complex_process"
    }
)`,
        difficulty: "Medium",
        category: "Conditional Logic"
      },
      {
        question: "How would you implement error handling and retry logic in a LangGraph workflow?",
        answer: `def safe_llm_node(state):
    max_retries = 3
    for attempt in range(max_retries):
        try:
            # LLM call here
            result = call_llm(state['input'])
            return {"output": result, "error": None}
        except Exception as e:
            if attempt == max_retries - 1:
                return {"output": None, "error": str(e)}
            continue

def error_condition(state):
    if state.get("error"):
        return "error_handler"
    return "success"

workflow.add_conditional_edges(
    "llm_node",
    error_condition,
    {
        "success": "next_node",
        "error_handler": "error_node"
    }
)`,
        difficulty: "Hard",
        category: "Error Handling"
      }
    ],
    scenarios: [
      {
        question: "Design a customer support agent that can handle inquiries, escalate to humans when needed, and maintain conversation context.",
        answer: "Key components: 1) Intent classification node 2) Knowledge base search 3) Response generation 4) Escalation logic based on confidence/complexity 5) State management for conversation history 6) Human handoff mechanism with context preservation.",
        difficulty: "Hard",
        category: "System Design"
      },
      {
        question: "How would you build a multi-step research assistant that can plan, execute, and synthesize information from multiple sources?",
        answer: "Architecture: 1) Planning node to break down queries 2) Web search nodes for information gathering 3) Document processing nodes 4) Synthesis node to combine findings 5) Validation node to check accuracy 6) Iterative refinement loop based on quality metrics.",
        difficulty: "Hard",
        category: "Multi-Agent Systems"
      }
    ]
  };

  const allQuestions = [
    ...interviewData.conceptual,
    ...interviewData.coding,
    ...interviewData.scenarios
  ];

  const handleNextQuestion = () => {
    if (currentQuestion < allQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowAnswer(false);
      setUserAnswer('');
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setShowAnswer(false);
      setUserAnswer('');
    }
  };

  const handleShowAnswer = () => {
    setShowAnswer(true);
    if (!answeredQuestions.has(currentQuestion)) {
      setAnsweredQuestions(new Set([...answeredQuestions, currentQuestion]));
      setScore(score + 1);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setAnsweredQuestions(new Set());
    setShowAnswer(false);
    setUserAnswer('');
  };

  const getCurrentQuestion = () => allQuestions[currentQuestion];

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const sections = [
    { id: 'overview', title: 'Overview', icon: BookOpen },
    { id: 'practice', title: 'Practice Questions', icon: Brain },
    { id: 'tips', title: 'Interview Tips', icon: Zap }
  ];

  if (currentSection === 'overview') {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Code className="h-12 w-12 text-indigo-600 mr-3" />
              <h1 className="text-4xl font-bold text-gray-800">LangGraph Interview Prep</h1>
            </div>
            <p className="text-gray-600 text-lg">Master LangGraph concepts and ace your interview</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setCurrentSection(section.id)}
                  className="p-6 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  <Icon className="h-8 w-8 mx-auto mb-3" />
                  <h3 className="font-semibold text-lg">{section.title}</h3>
                </button>
              );
            })}
          </div>

          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">What You'll Learn</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Core Concepts</h3>
                <ul className="space-y-1 text-blue-100">
                  <li>• StateGraph architecture</li>
                  <li>• Nodes and edges</li>
                  <li>• State management</li>
                  <li>• Conditional routing</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Advanced Topics</h3>
                <ul className="space-y-1 text-blue-100">
                  <li>• Human-in-the-loop workflows</li>
                  <li>• Error handling & retry logic</li>
                  <li>• Multi-agent systems</li>
                  <li>• Production deployment</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentSection === 'tips') {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <Zap className="h-8 w-8 text-yellow-500 mr-3" />
              <h1 className="text-3xl font-bold text-gray-800">Interview Tips</h1>
            </div>
            <button
              onClick={() => setCurrentSection('overview')}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Back to Overview
            </button>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Before the Interview</h2>
              <ul className="space-y-2">
                <li>• Review LangGraph documentation and examples</li>
                <li>• Practice building simple graphs from scratch</li>
                <li>• Understand the relationship with LangChain</li>
                <li>• Prepare real-world use case examples</li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">During the Interview</h2>
              <ul className="space-y-2">
                <li>• Start with simple explanations, then add complexity</li>
                <li>• Draw diagrams to illustrate graph structures</li>
                <li>• Discuss trade-offs between different approaches</li>
                <li>• Show awareness of production considerations</li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Common Pitfalls to Avoid</h2>
              <ul className="space-y-2">
                <li>• Don't confuse LangGraph with basic LangChain chains</li>
                <li>• Avoid overcomplicating simple problems</li>
                <li>• Don't ignore error handling in your solutions</li>
                <li>• Remember to discuss state management implications</li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Key Topics to Master</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Technical Skills</h3>
                  <ul className="space-y-1 text-orange-100">
                    <li>• Graph construction patterns</li>
                    <li>• State schema design</li>
                    <li>• Conditional edge logic</li>
                    <li>• Integration with tools/APIs</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">System Design</h3>
                  <ul className="space-y-1 text-orange-100">
                    <li>• Multi-agent architectures</li>
                    <li>• Scalability considerations</li>
                    <li>• Monitoring and debugging</li>
                    <li>• Production deployment</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Brain className="h-8 w-8 text-indigo-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-800">Practice Questions</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center bg-indigo-100 px-4 py-2 rounded-lg">
              <Trophy className="h-5 w-5 text-indigo-600 mr-2" />
              <span className="font-semibold text-indigo-800">{score}/{allQuestions.length}</span>
            </div>
            <button
              onClick={() => setCurrentSection('overview')}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Back
            </button>
            <button
              onClick={resetQuiz}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset
            </button>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <span className="text-lg font-semibold text-gray-700">
                Question {currentQuestion + 1} of {allQuestions.length}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(getCurrentQuestion().difficulty)}`}>
                {getCurrentQuestion().difficulty}
              </span>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {getCurrentQuestion().category}
              </span>
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
            <div 
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / allQuestions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Question:</h2>
          <p className="text-lg leading-relaxed">{getCurrentQuestion().question}</p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Answer:
          </label>
          <textarea
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Type your answer here..."
          />
        </div>

        {showAnswer && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
            <div className="flex items-center mb-3">
              <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
              <h3 className="text-lg font-semibold text-green-800">Sample Answer:</h3>
            </div>
            <p className="text-green-700 leading-relaxed">{getCurrentQuestion().answer}</p>
          </div>
        )}

        <div className="flex items-center justify-between">
          <button
            onClick={handlePrevQuestion}
            disabled={currentQuestion === 0}
            className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>

          <div className="flex space-x-3">
            {!showAnswer && (
              <button
                onClick={handleShowAnswer}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Show Answer
              </button>
            )}
          </div>

          <button
            onClick={handleNextQuestion}
            disabled={currentQuestion === allQuestions.length - 1}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </button>
        </div>

        <div className="mt-8 text-center text-gray-600">
          <p>Practice regularly and review the documentation for best results!</p>
        </div>
      </div>
    </div>
  );
};

export default LangGraphInterviewBot;