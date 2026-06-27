n=int(input())
total = 0

for i in range(n):
    name, temp, cough = input().split()
    if float(temp)>=37.5 and int(cough)==1:
        print(name)
        total+=1
print(total)