using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TodoApi.Models;

namespace TodoApi.Controllers
{
    //Defines an API controller class without methods
    //Marks the class with the [ApiController] attribute.
    //Uses DI to inject the database context (TodoContext) into the controller. 
    //Adds an item named Item1 to the database if the database is empty. This code is in the constructor, so it runs every time there's a new HTTP request. If you delete all items, the constructor creates Item1 again the next time an API method is called.

    [Route("api/todo")]
    [ApiController]
    public class TodoController : ControllerBase
    {
        private readonly TodoContext _context;

        public TodoController(TodoContext context)
        {
            _context = context;

            if (_context.TodoItems.Count() == 0)
            {
                // Create a new TodoItem if collection is empty,
                // which means you can't delete all TodoItems.
                _context.TodoItems.Add(new TodoItem { PercentComplete = "0" });
                _context.TodoItems.Add(new TodoItem { Title = "Title1" });
                _context.TodoItems.Add(new TodoItem { Name = "Item1" });
                _context.SaveChanges();
            }
        }

        //To provide an API that retrieves to-do items
        //These methods implement two GET endpoints

        // GET: api/Todo
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TodoItem>>> GetTodoItems()
        {
            return await _context.TodoItems.ToListAsync();
        }

        //In the following GetTodoItem method, "{id}" is a placeholder variable for the unique identifier of the to-do item. When GetTodoItem is invoked, the value of "{id}" in the URL is provided to the method in itsid parameter
        // GET: api/Todo/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TodoItem>> GetTodoItem(long id)
        {
            var todoItem = await _context.TodoItems.FindAsync(id);

            if (todoItem == null)
            {
                return NotFound();
            }

            return todoItem;
        }

        // This code is an HTTP POST method
        // The method gets the value of the to-do item from the body of the HTTP request
        // POST: api/Todo
        [HttpPost]
        public async Task<ActionResult<TodoItem>> PostTodoItem(TodoItem item)
        {
            _context.TodoItems.Add(item);
            await _context.SaveChangesAsync();

            // This method returns an HTTP 201 status code, if successful and add a Location header to the response
            return CreatedAtAction(nameof(GetTodoItem), new { id = item.Id }, item);
        }


        // PutTodoItem is similar to PostTodoItem, except it uses HTTP PUT
        // A PUT request requires the client to send the entire updated entity, not just the changes
        // PUT: api/Todo/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTodoItem(long id, TodoItem item)
        {
            if (id != item.Id)
            {
                return BadRequest();
            }

            _context.Entry(item).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DeleteTodoItem method to delete a to-do item
        // This method allows you to delete all the items. However, when the last item is deleted, a new one is created by the model class constructor the next time the API is called
        // DELETE: api/Todo/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTodoItem(long id)
        {
            var todoItem = await _context.TodoItems.FindAsync(id);

            if (todoItem == null)
            {
                return NotFound();
            }

            _context.TodoItems.Remove(todoItem);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}