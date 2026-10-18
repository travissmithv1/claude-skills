# Clean Code Examples

Concrete before/after examples demonstrating Clean Code principles.

---

## Naming Examples

### Intention-Revealing Names

```python
# Bad
def get(d):
    return [x for x in d if x[0] == 4]

# Good
def getFlaggedCells(gameBoard):
    return [cell for cell in gameBoard if cell.isFlagged()]
```

### Searchable Names

```python
# Bad
for i in range(34):
    s += t[i] * 4 / 5

# Good
WORK_DAYS_PER_WEEK = 5
HOURS_PER_DAY = 8
for i in range(NUMBER_OF_TASKS):
    realDaysPerIdealDay = 4
    realTaskDays = taskEstimate[i] * realDaysPerIdealDay
    realTaskWeeks = realTaskDays / WORK_DAYS_PER_WEEK
    sum += realTaskWeeks
```

### Class and Method Names

```python
# Classes: nouns
class Customer: ...
class WikiPage: ...
class AccountParser: ...

# Methods: verbs
def postPayment(): ...
def deletePage(): ...
def save(): ...

# Accessors/mutators/predicates
def getName(): ...      # get prefix
def setName(name): ...  # set prefix  
def isPosted(): ...     # is prefix for boolean
```

---

## Function Examples

### Small Functions

```python
# Bad: Function does too many things
def renderPageWithSetupsAndTeardowns(pageData, isSuite):
    if isTestPage(pageData):
        includeSetupAndTeardownPages(pageData, isSuite)
    return pageData.getHtml()

# Good: Extract to single responsibility
def renderPageWithSetupsAndTeardowns(pageData, isSuite):
    if isTestPage(pageData):
        includeSetupPages(pageData, isSuite)
        includeTestPage(pageData)
        includeTeardownPages(pageData, isSuite)
    return pageData.getHtml()
```

### Avoiding Flag Arguments

```python
# Bad: Flag argument
def render(isSuite):
    if isSuite:
        # render suite
    else:
        # render single

# Good: Separate functions
def renderForSuite(): ...
def renderForSingleTest(): ...
```

### Reducing Arguments

```python
# Bad: Too many arguments
def makeCircle(x, y, radius): ...

# Good: Group into object
def makeCircle(center: Point, radius): ...

# Bad: Output argument
def appendFooter(report): 
    report.append(footer)

# Good: Method on the object
report.appendFooter()
```

---

## Comment Examples

### Good Comments

```python
# Legal comment
# Copyright (c) 2024 Example Corp. All rights reserved.

# Explanation of intent
# We prefer this implementation because it's significantly 
# faster under load conditions we expect in production

# Warning
# WARNING: SimpleDateFormat is not thread safe. Each thread 
# must have its own instance.

# TODO (use sparingly)
# TODO: Move this to configuration once we have environment support
```

### Bad Comments (Refactor Instead)

```python
# Bad: Redundant comment
# Returns the day of the month
def getDayOfMonth():
    return dayOfMonth

# Bad: Noise comment
# Default constructor
def __init__(self):
    pass

# Bad: Commented-out code (just delete it)
# user.setEmail(email)
# user.setPhone(phone)
user.setName(name)

# Bad: Position marker
####################################
# UTILITY FUNCTIONS
####################################
```

### Replace Comments with Better Code

```python
# Bad: Comment explains unclear code
# Check to see if the employee is eligible for full benefits
if (employee.flags & HOURLY_FLAG) and (employee.age > 65):
    ...

# Good: Self-documenting code
if employee.isEligibleForFullBenefits():
    ...
```

---

## Error Handling Examples

### Use Exceptions, Not Return Codes

```python
# Bad: Error codes
class DeviceController:
    def sendShutdown(self):
        handle = getHandle(DEV1)
        if handle != INVALID_HANDLE:
            record = retrieveDeviceRecord(handle)
            if record.getStatus() != SUSPENDED:
                pauseDevice(handle)
                clearDeviceWorkQueue(handle)
                closeDevice(handle)
            else:
                logger.log("Device suspended")
        else:
            logger.log("Invalid handle")

# Good: Exceptions
class DeviceController:
    def sendShutdown(self):
        try:
            tryToShutDown()
        except DeviceShutdownError as e:
            logger.log(e)
    
    def tryToShutDown(self):
        handle = getHandle(DEV1)
        record = retrieveDeviceRecord(handle)
        pauseDevice(handle)
        clearDeviceWorkQueue(handle)
        closeDevice(handle)
```

### Don't Return Null

```python
# Bad: Returns null
def getEmployees():
    if no_employees:
        return None

# Caller must check
employees = getEmployees()
if employees is not None:
    for e in employees:
        ...

# Good: Return empty collection
def getEmployees():
    if no_employees:
        return []

# Caller doesn't need null check
for e in getEmployees():
    ...
```

---

## Class Examples

### Single Responsibility

```python
# Bad: Class with multiple responsibilities
class Employee:
    def calculatePay(self): ...      # Accounting rules
    def reportHours(self): ...       # Reporting rules  
    def save(self): ...              # Database rules

# Good: Separate by responsibility
class Employee:
    def __init__(self, data): 
        self.data = data

class EmployeePayCalculator:
    def calculatePay(self, employee): ...

class EmployeeReporter:
    def reportHours(self, employee): ...

class EmployeeRepository:
    def save(self, employee): ...
```

### Cohesion

```python
# Bad: Low cohesion (methods don't use instance variables)
class Stack:
    def __init__(self):
        self.topOfStack = 0
        self.elements = []
    
    def size(self):
        return self.topOfStack
    
    def push(self, element):
        self.topOfStack += 1
        self.elements.append(element)
    
    # This method doesn't use any instance variables
    def formatNumber(self, number):
        return f"{number:,}"

# Good: High cohesion (every method uses instance variables)
class Stack:
    def __init__(self):
        self.topOfStack = 0
        self.elements = []
    
    def size(self):
        return self.topOfStack
    
    def push(self, element):
        self.topOfStack += 1
        self.elements.append(element)
    
    def pop(self):
        if self.topOfStack == 0:
            raise EmptyStackException()
        self.topOfStack -= 1
        return self.elements.pop()
```

---

## Test Examples

### Clean Tests with One Concept

```python
# Bad: Multiple concepts in one test
def test_turnOnLoTempAlarmAtThreshold():
    hw.setTemp(WAY_TOO_COLD)
    controller.tic()
    assert hw.heaterState()
    assert hw.blowerState()
    assert not hw.coolerState()
    assert not hw.hiTempAlarm()
    assert hw.loTempAlarm()

# Good: Separate tests for each concept
def test_turnOnHeaterAndBlowerWhenTooCold():
    tooColD()
    assert hw.heaterState()
    assert hw.blowerState()

def test_turnOnLoTempAlarmWhenTooCold():
    tooCold()
    assert hw.loTempAlarm()

def test_turnOffCoolerWhenTooCold():
    tooCold()
    assert not hw.coolerState()
```

### Given-When-Then Pattern

```python
def test_should_calculate_total_with_discount():
    # Given
    cart = ShoppingCart()
    cart.add(Product("Widget", price=100))
    cart.applyDiscount(Discount(percent=10))
    
    # When
    total = cart.calculateTotal()
    
    # Then
    assert total == 90
```

---

## Law of Demeter Examples

```python
# Bad: Train wreck
output_dir = ctxt.getOptions().getScratchDir().getAbsolutePath()

# Good: Tell, don't ask
output_dir = ctxt.createScratchFileStream(classFileName)
```

```python
# Bad: Violates Demeter
def applyDiscount(order):
    price = order.getCustomer().getMembership().getDiscount().apply(order.getTotal())
    return price

# Good: Respects Demeter
def applyDiscount(order):
    return order.applyMembershipDiscount()
```