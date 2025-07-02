
var world = new World(1200, 700, '#2d2d2d');

// Create top bar
var topBar = new Morph(0, 0, 1200, 40, {
  draggable: false,
  fillColor: '#1a1a1a',
  outlineColor: '#444',
  outlineThickness: 1,
  cornerRadius: 0
});
world.addMorph(topBar);

// Add icon in top left corner
var iconMorph = new ImageMorph(5, 5, 30, 30, 'IMG_0017.png', {
  draggable: false
});
world.addMorph(iconMorph);

// Create main areas with dark theme using pure canvas (adjusted Y positions)
var blockPalette = new Morph(20, 90, 250, 560, {
  draggable: false,
  fillColor: '#1a1a1a',
  outlineColor: '#444',
  outlineThickness: 2,
  cornerRadius: 5
});
world.addMorph(blockPalette);

var scriptArea = new Morph(290, 90, 450, 560, {
  draggable: false,
  fillColor: '#252525',
  outlineColor: '#444',
  outlineThickness: 2,
  cornerRadius: 5
});
world.addMorph(scriptArea);

var stage = new Morph(760, 90, 400, 300, {
  draggable: false,
  fillColor: '#333',
  outlineColor: '#555',
  outlineThickness: 3,
  cornerRadius: 5
});
world.addMorph(stage);

var spriteList = new Morph(760, 410, 400, 240, {
  draggable: false,
  fillColor: '#1e1e1e',
  outlineColor: '#555',
  outlineThickness: 2,
  cornerRadius: 5
});
world.addMorph(spriteList);

// Add titles using TextMorph
var paletteTitle = new TextMorph(30, 60, 200, 25, "Block Palette", {
  font: 'bold 16px Arial',
  color: '#fff',
  fillColor: 'transparent',
  outlineColor: 'transparent'
});
world.addMorph(paletteTitle);

var scriptTitle = new TextMorph(300, 60, 200, 25, "Scripts", {
  font: 'bold 16px Arial',
  color: '#fff',
  fillColor: 'transparent',
  outlineColor: 'transparent'
});
world.addMorph(scriptTitle);

var stageTitle = new TextMorph(770, 60, 200, 25, "Stage", {
  font: 'bold 16px Arial',
  color: '#fff',
  fillColor: 'transparent',
  outlineColor: 'transparent'
});
world.addMorph(stageTitle);

var spriteTitle = new TextMorph(770, 385, 200, 25, "Sprites", {
  font: 'bold 16px Arial',
  color: '#fff',
  fillColor: 'transparent',
  outlineColor: 'transparent'
});
world.addMorph(spriteTitle);

// Block categories with gradients rendered via canvas
var categories = [
  {name: 'Motion', color: '#4A90E2', darkColor: '#357ABD', y: 120},
  {name: 'Looks', color: '#9C59D1', darkColor: '#7D4BA6', y: 150},
  {name: 'Sound', color: '#CF63CF', darkColor: '#A64FA6', y: 180},
  {name: 'Events', color: '#C88330', darkColor: '#A06927', y: 210},
  {name: 'Control', color: '#E1A91A', darkColor: '#B88715', y: 240},
  {name: 'Sensing', color: '#5CB3CC', darkColor: '#4A8FA3', y: 270},
  {name: 'Operators', color: '#59C059', darkColor: '#479947', y: 300},
  {name: 'Variables', color: '#EE7D16', darkColor: '#BF6412', y: 330}
];

var selectedCategory = 'Motion';
var categoryButtons = [];

// Custom Morph for gradient category buttons
function CategoryButtonMorph(x, y, width, height, category, isSelected) {
  Morph.call(this, x, y, width, height, {
    draggable: false,
    fillColor: isSelected ? category.color : '#444',
    outlineColor: '#666',
    outlineThickness: 1,
    cornerRadius: 3
  });
  this.category = category;
  this.isSelected = isSelected;
}
extend(CategoryButtonMorph, Morph);

CategoryButtonMorph.prototype.draw = function(ctx) {
  this._runAnimations();
  ctx.save();
  
  ctx.globalAlpha = this.opacity;
  
  // Create gradient if selected
  if (this.isSelected) {
    var gradient = ctx.createLinearGradient(this.x, this.y, this.x + this.width, this.y + this.height);
    gradient.addColorStop(0, this.category.color);
    gradient.addColorStop(1, this.category.darkColor);
    ctx.fillStyle = gradient;
  } else {
    ctx.fillStyle = this.fillColor;
  }
  
  this._drawRoundedRect(ctx, this.x, this.y, this.width, this.height, this.cornerRadius, 
                        this.isSelected ? gradient : this.fillColor);
  
  ctx.lineWidth = this.outlineThickness;
  ctx.strokeStyle = this.outlineColor;
  this._drawRoundedRectStroke(ctx, this.x, this.y, this.width, this.height, this.cornerRadius);
  
  ctx.restore();
  
  this.children.forEach(child => {
    child.tick();
    child.draw(ctx);
  });
};

categories.forEach(function(cat) {
  var button = new CategoryButtonMorph(30, cat.y, 200, 25, cat, cat.name === selectedCategory);
  
  var label = new TextMorph(35, cat.y + 3, 190, 20, cat.name, {
    font: '14px Arial',
    color: cat.name === selectedCategory ? '#fff' : '#ccc',
    fillColor: 'transparent',
    outlineColor: 'transparent'
  });
  
  button.onMouseDown = function() {
    selectedCategory = cat.name;
    updateCategorySelection();
    showBlocksForCategory(cat.name);
  };
  
  button.onTouchStart = function(evt, pos) {
    selectedCategory = cat.name;
    updateCategorySelection();
    showBlocksForCategory(cat.name);
  };
  
  world.addMorph(button);
  world.addMorph(label);
  categoryButtons.push({button: button, label: label, category: cat});
});

function updateCategorySelection() {
  categoryButtons.forEach(function(item) {
    item.button.isSelected = item.category.name === selectedCategory;
    item.button.fillColor = item.button.isSelected ? item.category.color : '#444';
    item.label.color = item.button.isSelected ? '#fff' : '#ccc';
  });
}

// Enhanced block definitions with input fields and parameters
var blockDefinitions = {
  Motion: [
    {text: 'move [] steps', color: '#4A90E2', type: 'command', shape: 'puzzle', inputs: [{type: 'number', default: '10'}]},
    {text: 'turn ↻ [] degrees', color: '#4A90E2', type: 'command', shape: 'puzzle', inputs: [{type: 'number', default: '15'}]},
    {text: 'turn ↺ [] degrees', color: '#4A90E2', type: 'command', shape: 'puzzle', inputs: [{type: 'number', default: '15'}]},
    {text: 'go to x: [] y: []', color: '#4A90E2', type: 'command', shape: 'puzzle', inputs: [{type: 'number', default: '0'}, {type: 'number', default: '0'}]},
    {text: 'glide [] secs to x: [] y: []', color: '#4A90E2', type: 'command', shape: 'puzzle', inputs: [{type: 'number', default: '1'}, {type: 'number', default: '0'}, {type: 'number', default: '0'}]},
    {text: 'point in direction []', color: '#4A90E2', type: 'command', shape: 'puzzle', inputs: [{type: 'number', default: '90'}]},
    {text: 'change x by []', color: '#4A90E2', type: 'command', shape: 'puzzle', inputs: [{type: 'number', default: '10'}]},
    {text: 'change y by []', color: '#4A90E2', type: 'command', shape: 'puzzle', inputs: [{type: 'number', default: '10'}]}
  ],
  Looks: [
    {text: 'say [] for [] secs', color: '#9C59D1', type: 'command', shape: 'puzzle', inputs: [{type: 'text', default: 'Hello!'}, {type: 'number', default: '2'}]},
    {text: 'say []', color: '#9C59D1', type: 'command', shape: 'puzzle', inputs: [{type: 'text', default: 'Hello!'}]},
    {text: 'show', color: '#9C59D1', type: 'command', shape: 'puzzle'},
    {text: 'hide', color: '#9C59D1', type: 'command', shape: 'puzzle'},
    {text: 'change size by []', color: '#9C59D1', type: 'command', shape: 'puzzle', inputs: [{type: 'number', default: '10'}]},
    {text: 'set size to []%', color: '#9C59D1', type: 'command', shape: 'puzzle', inputs: [{type: 'number', default: '100'}]}
  ],
  Sound: [
    {text: 'play sound []', color: '#CF63CF', type: 'command', shape: 'puzzle', inputs: [{type: 'text', default: 'pop'}]},
    {text: 'play sound [] until done', color: '#CF63CF', type: 'command', shape: 'puzzle', inputs: [{type: 'text', default: 'pop'}]},
    {text: 'change volume by []', color: '#CF63CF', type: 'command', shape: 'puzzle', inputs: [{type: 'number', default: '-10'}]}
  ],
  Events: [
    {text: 'when ⚑ clicked', color: '#C88330', type: 'hat', shape: 'hat'},
    {text: 'when [] key pressed', color: '#C88330', type: 'hat', shape: 'hat', inputs: [{type: 'text', default: 'space'}]},
    {text: 'when this sprite clicked', color: '#C88330', type: 'hat', shape: 'hat'},
    {text: 'broadcast []', color: '#C88330', type: 'command', shape: 'puzzle', inputs: [{type: 'text', default: 'message1'}]},
    {text: 'when I receive []', color: '#C88330', type: 'hat', shape: 'hat', inputs: [{type: 'text', default: 'message1'}]}
  ],
  Control: [
    {text: 'wait [] secs', color: '#E1A91A', type: 'command', shape: 'puzzle', inputs: [{type: 'number', default: '1'}]},
    {text: 'repeat []', color: '#E1A91A', type: 'c_block', shape: 'c_shape', inputs: [{type: 'number', default: '10'}]},
    {text: 'forever', color: '#E1A91A', type: 'c_block', shape: 'c_shape'},
    {text: 'if <> then', color: '#E1A91A', type: 'c_block', shape: 'c_shape'},
    {text: 'stop all', color: '#E1A91A', type: 'cap', shape: 'cap'},
    {text: 'stop this script', color: '#E1A91A', type: 'cap', shape: 'cap'}
  ],
  Sensing: [
    {text: 'touching []?', color: '#5CB3CC', type: 'boolean', shape: 'boolean', inputs: [{type: 'text', default: 'mouse-pointer'}]},
    {text: 'key [] pressed?', color: '#5CB3CC', type: 'boolean', shape: 'boolean', inputs: [{type: 'text', default: 'space'}]},
    {text: 'mouse x', color: '#5CB3CC', type: 'reporter', shape: 'oval'},
    {text: 'mouse y', color: '#5CB3CC', type: 'reporter', shape: 'oval'},
    {text: 'distance to []', color: '#5CB3CC', type: 'reporter', shape: 'oval', inputs: [{type: 'text', default: 'mouse-pointer'}]}
  ],
  Operators: [
    {text: '[] + []', color: '#59C059', type: 'reporter', shape: 'oval', inputs: [{type: 'number', default: ''}, {type: 'number', default: ''}]},
    {text: '[] - []', color: '#59C059', type: 'reporter', shape: 'oval', inputs: [{type: 'number', default: ''}, {type: 'number', default: ''}]},
    {text: '[] * []', color: '#59C059', type: 'reporter', shape: 'oval', inputs: [{type: 'number', default: ''}, {type: 'number', default: ''}]},
    {text: '[] / []', color: '#59C059', type: 'reporter', shape: 'oval', inputs: [{type: 'number', default: ''}, {type: 'number', default: ''}]},
    {text: '[] = []', color: '#59C059', type: 'boolean', shape: 'boolean', inputs: [{type: 'text', default: ''}, {type: 'text', default: ''}]},
    {text: '[] < []', color: '#59C059', type: 'boolean', shape: 'boolean', inputs: [{type: 'number', default: ''}, {type: 'number', default: ''}]},
    {text: '[] > []', color: '#59C059', type: 'boolean', shape: 'boolean', inputs: [{type: 'number', default: ''}, {type: 'number', default: ''}]},
    {text: '<> and <>', color: '#59C059', type: 'boolean', shape: 'boolean'},
    {text: '<> or <>', color: '#59C059', type: 'boolean', shape: 'boolean'},
    {text: 'not <>', color: '#59C059', type: 'boolean', shape: 'boolean'}
  ],
  Variables: [
    {text: 'set [] to []', color: '#EE7D16', type: 'command', shape: 'puzzle', inputs: [{type: 'text', default: 'my variable'}, {type: 'text', default: '0'}]},
    {text: 'change [] by []', color: '#EE7D16', type: 'command', shape: 'puzzle', inputs: [{type: 'text', default: 'my variable'}, {type: 'number', default: '1'}]},
    {text: '[]', color: '#EE7D16', type: 'reporter', shape: 'oval', inputs: [{type: 'text', default: 'my variable'}]}
  ]
};

var currentBlocks = [];
var duplicatedBlocks = [];

function showBlocksForCategory(categoryName) {
  // Clear existing blocks
  currentBlocks.forEach(function(block) {
    if (block.world) {
      world.removeMorph(block);
    }
  });
  currentBlocks = [];
  
  var blocks = blockDefinitions[categoryName] || [];
  var yPos = 370;
  
  blocks.forEach(function(blockDef, index) {
    var block = new ScratchBlockMorph(40, yPos, blockDef.text, blockDef.color, blockDef.type, {
      draggable: false,
      isPalette: true,
      shape: blockDef.shape,
      inputs: blockDef.inputs || [],
      targetSprite: selectedSprite ? selectedSprite.spriteName : 'Sprite1'
    });
    
    // Add duplication on drag start
    block.onDragStart = function() {
      var duplicate = new ScratchBlockMorph(
        this.x + 250, 
        this.y, 
        this.text, 
        this.blockColor, 
        this.blockType, 
        {
          draggable: true,
          isPalette: false,
          shape: this.shape,
          inputs: blockDef.inputs || [],
          targetSprite: selectedSprite ? selectedSprite.spriteName : 'Sprite1'
        }
      );
      
      // Copy input values from palette block
      if (this.inputs && duplicate.inputs) {
        this.inputs.forEach(function(input, i) {
          if (duplicate.inputs[i]) {
            duplicate.inputs[i].value = input.value;
          }
        });
      }
      
      world.addMorph(duplicate);
      duplicatedBlocks.push(duplicate);
      
      // Transfer drag to duplicate
      world._draggingMorph = duplicate;
      duplicate._setActive(true);
    };
    
    // Add touch start handler for duplication
    block.onTouchStart = function(evt, pos) {
      if (this.isPalette) {
        var duplicate = new ScratchBlockMorph(
          this.x + 250, 
          this.y, 
          this.text, 
          this.blockColor, 
          this.blockType, 
          {
            draggable: true,
            isPalette: false,
            shape: this.shape,
            inputs: blockDef.inputs || [],
            targetSprite: selectedSprite ? selectedSprite.spriteName : 'Sprite1'
          }
        );
        
        // Copy input values from palette block
        if (this.inputs && duplicate.inputs) {
          this.inputs.forEach(function(input, i) {
            if (duplicate.inputs[i]) {
              duplicate.inputs[i].value = input.value;
            }
          });
        }
        
        world.addMorph(duplicate);
        duplicatedBlocks.push(duplicate);
        
        // Start dragging the duplicate
        world._draggingMorph = duplicate;
        world._dragOffsetX = pos.x - duplicate.x;
        world._dragOffsetY = pos.y - duplicate.y;
        duplicate._setActive(true);
        if (duplicate.onDragStart) duplicate.onDragStart();
      }
    };
    
    world.addMorph(block);
    currentBlocks.push(block);
    yPos += 35;
  });
}

// Enhanced execution engine with multi-threaded sprite support
var ExecutionEngine = {
  threads: [],
  spriteVariables: {},
  broadcasts: {},
  isRunning: false,
  
  parseBlocksToAST: function() {
    var ast = {};
    
    // Parse blocks for each sprite
    sprites.forEach(function(sprite) {
      ast[sprite.spriteName] = [];
      var spriteBlocks = duplicatedBlocks.filter(b => b.world && b.targetSprite === sprite.spriteName);
      
      spriteBlocks.forEach(function(block) {
        if (block.blockType === 'hat') {
          ast[sprite.spriteName].push({
            type: 'event',
            event: block.text,
            sprite: sprite,
            children: this.getConnectedBlocks(block)
          });
        }
      }.bind(this));
    }.bind(this));
    
    return ast;
  },
  
  getConnectedBlocks: function(block) {
    var connected = [];
    var current = block.connectBelow;
    while (current) {
      connected.push({
        type: current.blockType,
        text: current.text,
        block: current,
        inputs: current.inputs || []
      });
      current = current.connectBelow;
    }
    return connected;
  },
  
  executeAST: function(ast) {
    // Create threads for each sprite's event handlers
    Object.keys(ast).forEach(function(spriteName) {
      var spriteEvents = ast[spriteName];
      spriteEvents.forEach(function(event) {
        if (event.type === 'event') {
          this.createThread(event.children, event.sprite, event.event);
        }
      }.bind(this));
    }.bind(this));
  },
  
  createThread: function(commands, sprite, eventType) {
    var thread = {
      id: Date.now() + Math.random(),
      commands: commands,
      currentIndex: 0,
      isActive: true,
      sprite: sprite,
      eventType: eventType,
      variables: {}
    };
    this.threads.push(thread);
    this.executeThread(thread);
  },
  
  executeThread: function(thread) {
    if (!thread.isActive || thread.currentIndex >= thread.commands.length) {
      thread.isActive = false;
      return;
    }
    
    var command = thread.commands[thread.currentIndex];
    var delay = this.executeCommand(command, thread);
    thread.currentIndex++;
    
    if (thread.isActive) {
      setTimeout(() => this.executeThread(thread), delay || 50);
    }
  },
  
  executeCommand: function(command, thread) {
    var sprite = thread.sprite;
    var text = command.text;
    var inputs = command.inputs || [];
    
    console.log('Executing on', sprite.spriteName + ':', text);
    
    // Motion commands
    if (text.includes('move') && text.includes('steps')) {
      var steps = this.getInputValue(inputs[0]) || 10;
      var radians = (sprite.direction || 90) * Math.PI / 180;
      sprite.x += Math.cos(radians) * steps;
      sprite.y += Math.sin(radians) * steps;
    } else if (text.includes('turn ↻')) {
      var degrees = this.getInputValue(inputs[0]) || 15;
      sprite.direction = (sprite.direction || 90) + degrees;
    } else if (text.includes('turn ↺')) {
      var degrees = this.getInputValue(inputs[0]) || 15;
      sprite.direction = (sprite.direction || 90) - degrees;
    } else if (text.includes('go to x:')) {
      var x = this.getInputValue(inputs[0]) || 0;
      var y = this.getInputValue(inputs[1]) || 0;
      sprite.x = 860 + x;
      sprite.y = 150 + y;
    } else if (text.includes('change x by')) {
      var delta = this.getInputValue(inputs[0]) || 10;
      sprite.x += delta;
    } else if (text.includes('change y by')) {
      var delta = this.getInputValue(inputs[0]) || 10;
      sprite.y += delta;
    } else if (text.includes('point in direction')) {
      sprite.direction = this.getInputValue(inputs[0]) || 90;
    }
    
    // Looks commands
    else if (text.includes('say') && text.includes('for')) {
      var message = this.getInputValue(inputs[0]) || 'Hello!';
      var duration = this.getInputValue(inputs[1]) || 2;
      console.log(sprite.spriteName + ' says:', message);
      return duration * 1000; // Return delay in milliseconds
    } else if (text.includes('say ') && !text.includes('for')) {
      var message = this.getInputValue(inputs[0]) || 'Hello!';
      console.log(sprite.spriteName + ' says:', message);
    } else if (text === 'show') {
      sprite.visible = true;
      sprite.opacity = 1;
    } else if (text === 'hide') {
      sprite.visible = false;
      sprite.opacity = 0;
    } else if (text.includes('change size by')) {
      var change = this.getInputValue(inputs[0]) || 10;
      sprite.size = Math.max(0, (sprite.size || 100) + change);
      var scale = sprite.size / 100;
      sprite.radius = 20 * scale;
      sprite.width = sprite.radius * 2;
      sprite.height = sprite.radius * 2;
    } else if (text.includes('set size to')) {
      sprite.size = this.getInputValue(inputs[0]) || 100;
      var scale = sprite.size / 100;
      sprite.radius = 20 * scale;
      sprite.width = sprite.radius * 2;
      sprite.height = sprite.radius * 2;
    }
    
    // Control commands
    else if (text.includes('wait') && text.includes('secs')) {
      var seconds = this.getInputValue(inputs[0]) || 1;
      return seconds * 1000; // Return delay in milliseconds
    } else if (text.includes('repeat')) {
      var times = this.getInputValue(inputs[0]) || 10;
      // TODO: Implement repeat loop
      console.log('Repeat', times, 'times');
    } else if (text === 'forever') {
      // TODO: Implement forever loop
      console.log('Forever loop');
    } else if (text === 'stop all') {
      this.stop();
    } else if (text === 'stop this script') {
      thread.isActive = false;
    }
    
    // Variables
    else if (text.includes('set') && text.includes('to')) {
      var varName = this.getInputValue(inputs[0]) || 'my variable';
      var value = this.getInputValue(inputs[1]) || 0;
      thread.variables[varName] = value;
      if (!this.spriteVariables[sprite.spriteName]) {
        this.spriteVariables[sprite.spriteName] = {};
      }
      this.spriteVariables[sprite.spriteName][varName] = value;
    } else if (text.includes('change') && text.includes('by')) {
      var varName = this.getInputValue(inputs[0]) || 'my variable';
      var change = this.getInputValue(inputs[1]) || 1;
      if (!this.spriteVariables[sprite.spriteName]) {
        this.spriteVariables[sprite.spriteName] = {};
      }
      var currentValue = this.spriteVariables[sprite.spriteName][varName] || 0;
      this.spriteVariables[sprite.spriteName][varName] = currentValue + change;
    }
    
    // Broadcasting
    else if (text.includes('broadcast')) {
      var message = this.getInputValue(inputs[0]) || 'message1';
      this.broadcast(message);
    }
    
    return 0; // Default no delay
  },
  
  getInputValue: function(input) {
    if (!input) return null;
    if (typeof input === 'string') return input;
    if (typeof input === 'object' && input.value !== undefined) {
      return input.value;
    }
    return input;
  },
  
  broadcast: function(message) {
    console.log('Broadcasting:', message);
    // Find all "when I receive" blocks and trigger them
    sprites.forEach(function(sprite) {
      var spriteBlocks = duplicatedBlocks.filter(b => 
        b.world && 
        b.targetSprite === sprite.spriteName && 
        b.blockType === 'hat' && 
        b.text.includes('when I receive')
      );
      
      spriteBlocks.forEach(function(block) {
        var receivedMessage = block.inputs && block.inputs[0] ? this.getInputValue(block.inputs[0]) : 'message1';
        if (receivedMessage === message) {
          var commands = this.getConnectedBlocks(block);
          this.createThread(commands, sprite, 'broadcast:' + message);
        }
      }.bind(this));
    }.bind(this));
  },
  
  start: function() {
    this.isRunning = true;
    this.threads = [];
    var ast = this.parseBlocksToAST();
    this.executeAST(ast);
  },
  
  stop: function() {
    this.isRunning = false;
    this.threads.forEach(t => t.isActive = false);
    this.threads = [];
  }
};

// Initialize with Motion blocks
showBlocksForCategory('Motion');

// Sprite management system
var sprites = [];
var selectedSprite = null;
var spriteCounter = 1;

function createSprite(x, y, name, color) {
  var sprite = new CircleMorph(x || 860, y || 150, 20, {
    fillColor: color || '#ff6b6b',
    outlineColor: '#fff',
    outlineThickness: 2,
    draggable: true
  });
  sprite.spriteName = name || 'Sprite' + spriteCounter++;
  sprite.scripts = [];
  sprite.x = x || 860;
  sprite.y = y || 150;
  sprite.direction = 90;
  sprite.size = 100;
  sprite.visible = true;
  
  world.addMorph(sprite);
  sprites.push(sprite);
  return sprite;
}

// Create initial sprite
var defaultSprite = createSprite(860, 150, 'Sprite1', '#ff6b6b');
selectedSprite = defaultSprite;

// Function to update sprite list display
function updateSpriteList() {
  // Clear existing sprite thumbnails
  var existingThumbs = world.morphs.filter(m => m.isSpriteThumb);
  existingThumbs.forEach(thumb => world.removeMorph(thumb));
  
  sprites.forEach(function(sprite, index) {
    var yPos = 430 + index * 30;
    
    var spriteThumb = new CircleMorph(780, yPos, 15, {
      fillColor: sprite.fillColor,
      outlineColor: selectedSprite === sprite ? '#fff' : '#666',
      outlineThickness: selectedSprite === sprite ? 2 : 1,
      draggable: false
    });
    spriteThumb.isSpriteThumb = true;
    spriteThumb.linkedSprite = sprite;
    
    spriteThumb.onMouseDown = function() {
      selectedSprite = this.linkedSprite;
      updateSpriteList();
      showBlocksForSprite(selectedSprite);
    };
    
    spriteThumb.onTouchStart = function(evt, pos) {
      selectedSprite = this.linkedSprite;
      updateSpriteList();
      showBlocksForSprite(selectedSprite);
    };
    
    var spriteLabel = new TextMorph(810, yPos - 5, 100, 20, sprite.spriteName, {
      font: '12px Arial',
      color: selectedSprite === sprite ? '#fff' : '#ccc',
      fillColor: 'transparent',
      outlineColor: 'transparent'
    });
    spriteLabel.isSpriteThumb = true;
    
    world.addMorph(spriteThumb);
    world.addMorph(spriteLabel);
  });
}

// Add new sprite button
var addSpriteButton = new TextMorph(770, 660, 80, 25, "+ Add Sprite", {
  font: '12px Arial',
  color: '#fff',
  fillColor: '#4CAF50',
  outlineColor: '#45a049',
  outlineThickness: 1,
  cornerRadius: 3
});

addSpriteButton.onMouseDown = function() {
  var colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#f368e0'];
  var randomColor = colors[Math.floor(Math.random() * colors.length)];
  var newSprite = createSprite(
    860 + Math.random() * 100, 
    150 + Math.random() * 100, 
    'Sprite' + spriteCounter, 
    randomColor
  );
  selectedSprite = newSprite;
  updateSpriteList();
  showBlocksForSprite(selectedSprite);
};

addSpriteButton.onTouchStart = function(evt, pos) {
  var colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#f368e0'];
  var randomColor = colors[Math.floor(Math.random() * colors.length)];
  var newSprite = createSprite(
    860 + Math.random() * 100, 
    150 + Math.random() * 100, 
    'Sprite' + spriteCounter, 
    randomColor
  );
  selectedSprite = newSprite;
  updateSpriteList();
  showBlocksForSprite(selectedSprite);
};

world.addMorph(addSpriteButton);

function showBlocksForSprite(sprite) {
  // This will be used to filter blocks by sprite
  console.log('Showing blocks for sprite:', sprite.spriteName);
}

// Initialize sprite list
updateSpriteList();

// Custom Morph for gradient buttons
function GradientButtonMorph(x, y, width, height, text, color1, color2) {
  Morph.call(this, x, y, width, height, {
    draggable: false,
    fillColor: color1,
    outlineColor: color2,
    outlineThickness: 2,
    cornerRadius: 5
  });
  this.text = text;
  this.color1 = color1;
  this.color2 = color2;
}
extend(GradientButtonMorph, Morph);

GradientButtonMorph.prototype.draw = function(ctx) {
  this._runAnimations();
  ctx.save();
  
  ctx.globalAlpha = this.opacity;
  
  if (this.active || this.hover) {
    ctx.shadowColor = this.shadowColor;
    ctx.shadowBlur = this.shadowBlur;
    ctx.shadowOffsetX = this.shadowOffsetX;
    ctx.shadowOffsetY = this.shadowOffsetY;
  }
  
  // Create gradient
  var gradient = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.height);
  gradient.addColorStop(0, this.color1);
  gradient.addColorStop(1, this.color2);
  
  ctx.fillStyle = gradient;
  this._drawRoundedRect(ctx, this.x, this.y, this.width, this.height, this.cornerRadius, gradient);
  
  ctx.lineWidth = this.outlineThickness;
  ctx.strokeStyle = this.outlineColor;
  this._drawRoundedRectStroke(ctx, this.x, this.y, this.width, this.height, this.cornerRadius);
  
  // Draw text
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 14px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(this.text, this.x + this.width/2, this.y + this.height/2);
  
  ctx.restore();
  
  this.children.forEach(child => {
    child.tick();
    child.draw(ctx);
  });
};

// Add run button with gradients rendered via canvas
var runButton = new GradientButtonMorph(770, 690, 80, 30, "Run", '#4CAF50', '#45a049');
world.addMorph(runButton);

var stopButton = new GradientButtonMorph(860, 690, 80, 30, "Stop", '#f44336', '#d32f2f');
world.addMorph(stopButton);

// Enhanced execution logic
runButton.onMouseDown = function() {
  console.log("Starting execution engine...");
  ExecutionEngine.start();
};

runButton.onTouchStart = function(evt, pos) {
  console.log("Starting execution engine...");
  ExecutionEngine.start();
};

stopButton.onMouseDown = function() {
  console.log("Stopping execution engine...");
  ExecutionEngine.stop();
};

stopButton.onTouchStart = function(evt, pos) {
  console.log("Stopping execution engine...");
  ExecutionEngine.stop();
};
