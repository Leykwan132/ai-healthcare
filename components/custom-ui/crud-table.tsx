"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";

interface CrudTableProps {
  tableName: string;
  columns: {
    name: string;
    type: string;
    required?: boolean;
    isPrimary?: boolean;
    isForeign?: boolean;
    foreignTable?: string;
  }[];
  title: string;
  description?: string;
}

interface Record {
  [key: string]: any;
}

export function CrudTable({ tableName, columns, title, description }: CrudTableProps) {
  const [records, setRecords] = useState<Record[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingRecord, setEditingRecord] = useState<Record | null>(null);
  const [newRecord, setNewRecord] = useState<Record>({});
  const [showForm, setShowForm] = useState(false);
  const [foreignData, setForeignData] = useState<{ [key: string]: Record[] }>({});
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    checkAuth();
  }, [supabase.auth]);

  // Load records
  const loadRecords = async () => {
    setLoading(true);
    setError(null);
    try {
      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError("Please sign in to access this data");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.from(tableName).select('*');
      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      setRecords(data || []);
    } catch (error) {
      console.error('Error loading records:', error);
      setError(`Error loading records: ${(error as any).message}`);
    } finally {
      setLoading(false);
    }
  };

  // Load foreign key data
  const loadForeignData = async () => {
    const foreignColumns = columns.filter(col => col.isForeign && col.foreignTable);
    for (const column of foreignColumns) {
      if (column.foreignTable) {
        try {
          const { data, error } = await supabase.from(column.foreignTable).select('*');
          if (!error && data) {
            setForeignData(prev => ({ ...prev, [column.foreignTable!]: data }));
          }
        } catch (error) {
          console.error(`Error loading foreign data for ${column.foreignTable}:`, error);
        }
      }
    }
  };

  useEffect(() => {
    if (user) {
      loadRecords();
      loadForeignData();
    }
  }, [tableName, user]);

  // Create record
  const handleCreate = async () => {
    try {
      setError(null);
      
      // Validate required fields
      const requiredFields = columns.filter(col => col.required && !col.isPrimary);
      const missingFields = requiredFields.filter(col => {
        const value = newRecord[col.name];
        return value === undefined || value === null || value === '';
      });
      
      if (missingFields.length > 0) {
        throw new Error(`Required fields missing: ${missingFields.map(f => f.name).join(', ')}`);
      }
      
      // Prepare record for insertion
      const recordToInsert = { ...newRecord };
      
      // Remove undefined values and empty strings for non-required fields
      Object.keys(recordToInsert).forEach(key => {
        const column = columns.find(col => col.name === key);
        if (!column?.required && (recordToInsert[key] === '' || recordToInsert[key] === undefined)) {
          delete recordToInsert[key];
        }
      });
      
      console.log('Attempting to insert record:', recordToInsert);
      console.log('Table name:', tableName);
      
      const { data, error } = await supabase.from(tableName).insert([recordToInsert]).select();
      
      console.log('Insert result:', { data, error });
      
      if (error) {
        console.error('Supabase insert error:', error);
        throw error;
      }
      
      setNewRecord({});
      setShowForm(false);
      loadRecords();
    } catch (error) {
      console.error('Error creating record:', error);
      setError(`Error creating record: ${(error as any).message}`);
    }
  };

  // Update record
  const handleUpdate = async () => {
    if (!editingRecord) return;
    try {
      setError(null);
      const { error } = await supabase
        .from(tableName)
        .update(editingRecord)
        .eq('id', editingRecord.id);
      if (error) throw error;
      setEditingRecord(null);
      loadRecords();
    } catch (error) {
      console.error('Error updating record:', error);
      setError(`Error updating record: ${(error as any).message}`);
    }
  };

  // Delete record
  const handleDelete = async (id: string | number) => {
    if (!confirm('Are you sure you want to delete this record?')) return;
    try {
      setError(null);
      const { error } = await supabase.from(tableName).delete().eq('id', id);
      if (error) throw error;
      loadRecords();
    } catch (error) {
      console.error('Error deleting record:', error);
      setError(`Error deleting record: ${(error as any).message}`);
    }
  };

  // Get display value for foreign keys and special data types
  const getDisplayValue = (columnName: string, value: any) => {
    const column = columns.find(col => col.name === columnName);
    
    // Handle foreign key references
    if (column?.isForeign && column.foreignTable && foreignData[column.foreignTable]) {
      const foreignRecord = foreignData[column.foreignTable].find((item: any) => item.id === value);
      return foreignRecord ? foreignRecord.name || foreignRecord.email || foreignRecord.title || foreignRecord.full_name || value : value;
    }
    
    // Handle JSONB/JSON objects
    if (column?.type === 'jsonb' || column?.type === 'json') {
      if (value === null || value === undefined) {
        return '';
      }
      if (typeof value === 'object') {
        return JSON.stringify(value, null, 2);
      }
      return value;
    }
    
    // Handle arrays
    if (column?.type === 'text[]' && Array.isArray(value)) {
      return value.join(', ');
    }
    
    // Handle boolean values
    if (column?.type === 'boolean') {
      return value ? 'true' : 'false';
    }
    
    // Handle null/undefined values
    if (value === null || value === undefined) {
      return '';
    }
    
    return value;
  };

  // Render form field
  const renderFormField = (column: any, value: any, onChange: (value: any) => void) => {
    if (column.isPrimary) return null;

    if (column.isForeign && column.foreignTable && foreignData[column.foreignTable]) {
      return (
        <select
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-2 border rounded"
          required={column.required}
        >
          <option value="">Select {column.name}</option>
          {foreignData[column.foreignTable].map((item: any) => (
            <option key={item.id} value={item.id}>
              {item.name || item.email || item.title || item.full_name || item.id}
            </option>
          ))}
        </select>
      );
    }

    if (column.type === 'boolean') {
      return (
        <input
          type="checkbox"
          checked={value || false}
          onChange={(e) => onChange(e.target.checked)}
          className="w-4 h-4"
        />
      );
    }

    if (column.type === 'date') {
      return (
        <Input
          type="date"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          required={column.required}
        />
      );
    }

    if (column.type === 'jsonb' || column.type === 'json') {
      return (
        <textarea
          value={typeof value === 'string' ? value : JSON.stringify(value, null, 2)}
          onChange={(e) => {
            try {
              onChange(JSON.parse(e.target.value));
            } catch {
              onChange(e.target.value);
            }
          }}
          className="w-full p-2 border rounded"
          rows={3}
          placeholder="Enter JSON data"
        />
      );
    }

    if (column.type === 'text[]') {
      return (
        <textarea
          value={Array.isArray(value) ? value.join(', ') : value || ''}
          onChange={(e) => onChange(e.target.value.split(',').map(s => s.trim()))}
          className="w-full p-2 border rounded"
          rows={2}
          placeholder="Enter comma-separated values"
        />
      );
    }

    return (
      <Input
        type={column.type === 'timestamp' ? 'datetime-local' : 'text'}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        required={column.required}
      />
    );
  };

  if (!user) {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">{title}</h1>
            {description && <p className="text-gray-600">{description}</p>}
          </div>
          <Link href="/auth/login">
            <Button>Sign in to continue</Button>
          </Link>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <p className="text-yellow-800">Please sign in to access this data.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          {description && <p className="text-gray-600">{description}</p>}
        </div>
        <Link href="/operations">
          <Button variant="outline">Back to Operations</Button>
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Add New Record</CardTitle>
        </CardHeader>
        <CardContent>
          {showForm ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {columns.map((column) => (
                <div key={column.name}>
                  <label className="block text-sm font-medium mb-1">
                    {column.name} {column.required && <span className="text-red-500">*</span>}
                  </label>
                  {renderFormField(column, newRecord[column.name], (value) =>
                    setNewRecord(prev => ({ ...prev, [column.name]: value }))
                  )}
                </div>
              ))}
              <div className="flex gap-2">
                <Button onClick={handleCreate}>Create</Button>
                <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              </div>
            </div>
          ) : (
            <Button onClick={() => setShowForm(true)}>Add New</Button>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Records ({records.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading...</p>
          ) : records.length === 0 ? (
            <p>No records found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    {columns.map((column) => (
                      <th key={column.name} className="border border-gray-300 px-4 py-2 text-left">
                        {column.name}
                      </th>
                    ))}
                    <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record) => (
                    <tr key={record.id}>
                      {columns.map((column) => (
                        <td key={column.name} className="border border-gray-300 px-4 py-2">
                          {editingRecord?.id === record.id ? (
                            renderFormField(column, editingRecord?.[column.name], (value) =>
                              setEditingRecord(prev => prev ? { ...prev, [column.name]: value } : null)
                            )
                          ) : (
                            <span>{getDisplayValue(column.name, record[column.name])}</span>
                          )}
                        </td>
                      ))}
                      <td className="border border-gray-300 px-4 py-2">
                        {editingRecord?.id === record.id ? (
                          <div className="flex gap-2">
                            <Button size="sm" onClick={handleUpdate}>Save</Button>
                            <Button size="sm" variant="outline" onClick={() => setEditingRecord(null)}>Cancel</Button>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => setEditingRecord(record)}>Edit</Button>
                            <Button size="sm" variant="destructive" onClick={() => handleDelete(record.id)}>Delete</Button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
