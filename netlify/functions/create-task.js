const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client using environment variables
// Using anon key to maintain RLS compatibility with your existing setup
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

/**
 * Netlify Function to create a new task in Supabase.
 * This function expects a POST request with task data and user_id in the body.
 * 
 * Required Environment Variables:
 * - VITE_SUPABASE_URL: Your Supabase project URL
 * - VITE_SUPABASE_ANON_KEY: Your Supabase public anon key
 */
exports.handler = async (event, context) => {
  // Set CORS headers for all responses
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*', // Configure this to your domain in production
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: '',
    };
  }

  // Ensure only POST requests are accepted
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        ...corsHeaders,
        'Allow': 'POST, OPTIONS'
      },
      body: JSON.stringify({ error: 'Method Not Allowed. Only POST requests are supported.' }),
    };
  }

  // Validate environment variables
  if (!process.env.VITE_SUPABASE_URL || !process.env.VITE_SUPABASE_ANON_KEY) {
    console.error('Missing Supabase environment variables.');
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Server configuration error: Supabase credentials missing.' }),
    };
  }

  let taskData;
  try {
    taskData = JSON.parse(event.body);
  } catch (error) {
    // Handle invalid JSON in request body
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Invalid JSON in request body.' }),
    };
  }

  const { title, description, priority, status, user_id } = taskData;

  // Input validation: Ensure required fields are present
  if (!title || !user_id) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Missing required fields: title and user_id.' }),
    };
  }

  // Validate title length
  if (title.trim().length === 0) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Title cannot be empty.' }),
    };
  }

  // Define allowed priority and status values for validation
  const allowedPriorities = ['low', 'medium', 'high'];
  const allowedStatuses = ['not_started', 'wip', 'completed'];

  if (priority && !allowedPriorities.includes(priority)) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ 
        error: `Invalid priority value. Must be one of: ${allowedPriorities.join(', ')}.` 
      }),
    };
  }

  if (status && !allowedStatuses.includes(status)) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ 
        error: `Invalid status value. Must be one of: ${allowedStatuses.join(', ')}.` 
      }),
    };
  }

  try {
    // Insert the new task into the 'tasks' table
    const { data, error } = await supabase
      .from('tasks')
      .insert([
        {
          user_id: user_id,
          title: title.trim(),
          description: description ? description.trim() : '',
          priority: priority || 'medium',
          status: status || 'not_started'
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      
      // Handle specific Supabase errors
      if (error.code === 'PGRST116') {
        return {
          statusCode: 404,
          headers: corsHeaders,
          body: JSON.stringify({ error: 'Table not found. Please check your database schema.' }),
        };
      }
      
      if (error.code === '23505') { // Unique constraint violation
        return {
          statusCode: 409,
          headers: corsHeaders,
          body: JSON.stringify({ error: 'A task with this information already exists.' }),
        };
      }

      return {
        statusCode: 500,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Failed to create task. Please try again.' }),
      };
    }

    // Log successful task creation (without sensitive data)
    console.log(`Task created successfully: ${data.id} for user: ${user_id}`);

    // Return the newly created task
    return {
      statusCode: 201,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error('Unexpected error in create-task function:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Internal server error during task creation.' }),
    };
  }
};