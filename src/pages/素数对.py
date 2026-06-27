import math as m

n=int(input())
nums=[x for x in range (2,n+1)]
for i in range(2, n+1):
    for j in range(2, m.ceil(i/2)+1):
        if i%j == 0:
            nums.remove(i)
            break

status=False
ans=list()
for i in range(0, len(nums)-1):
    if nums[i]+2==nums[i+1]:
        print(nums[i], nums[i+1])
        status=True
if status==False: print("empty")